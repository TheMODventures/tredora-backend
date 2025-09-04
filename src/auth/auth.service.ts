import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TokenService } from '../token/token.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private tokenService: TokenService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, fullName, corporateName, designation, username } = registerDto;

    // Parallel operations: Check uniqueness and hash password
    const [existingUsers, hashedPassword] = await Promise.all([
      this.prisma.user.findMany({
        where: {
          OR: [
            { email },
            { username }
          ]
        },
        select: { email: true, username: true }
      }),
      bcrypt.hash(password, 8) // Reduced from 10 to 8 for faster hashing
    ]);

    // Check for conflicts
    const emailExists = existingUsers.some(user => user.email === email);
    const usernameExists = existingUsers.some(user => user.username === username);

    if (emailExists) {
      throw new ConflictException('User with this email already exists');
    }
    if (usernameExists) {
      throw new ConflictException('Username already exists');
    }

    const result = await this.prisma.$transaction(async (prisma) => {
      const user = await prisma.user.create({
        data: {
          email,
          username,
          password: hashedPassword,
          profile: {
            create: {
              fullName,
              corporate: {
                create: {
                  name: corporateName,
                  designation
                }
              }
            }
          }
        },
      });

      return user;
    });

    const { accessToken, refreshToken } = await this.tokenService.generateTokens(result.id, result.email);
    
    // Don't await token saving - let it happen asynchronously
    this.tokenService.saveTokens(result.id, accessToken, refreshToken).catch(console.error);

    const { password: _, ...userWithoutPassword } = result;

    return {
      user: userWithoutPassword,
      accessToken,
      refreshToken,
    };
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate and save tokens
    const { accessToken, refreshToken } = await this.tokenService.generateTokens(user.id, user.email);
    await this.tokenService.saveTokens(user.id, accessToken, refreshToken);

    return {
      user: {
        id: user.id,
        email: user.email,
        isActive: user.isActive,
      },
      accessToken,
      refreshToken,
    };
  }

  async logout(user: string) {
    await this.tokenService.revokeTokens(user);
    return { message: 'Logged out successfully' };
  }

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    if (!user.isActive) {
      throw new UnauthorizedException('User account is deactivated');
    }

    return user;
  }

  async getProfile(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        profile: true,
      },
    });
  }
}