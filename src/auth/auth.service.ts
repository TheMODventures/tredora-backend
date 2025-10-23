import { Injectable, ConflictException, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TokenService } from '../token/token.service';
import { RegisterDto } from './dto/register.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { OtpUtils } from '../utils/otp.utils';
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
      bcrypt.hash(password, 8) 
    ]);

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

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('User with this email does not exist');
    }

    // Invalidate any existing OTPs for this user
    await this.prisma.otp.updateMany({
      where: {
        userId: user.id,
        isUsed: false,
      },
      data: {
        isUsed: true,
      },
    });

    // Generate a 6-digit OTP
    const otp = OtpUtils.generateOtp(6);
    
    // Create OTP with 10 minutes expiry
    const expiresAt = OtpUtils.generateOtpExpiry(10);

    await this.prisma.otp.create({
      data: {
        email,
        code: otp,
        userId: user.id,
        expiresAt,
      },
    });

    // In production, you would send this OTP via email
    // For now, we'll return it in the response (remove in production)
    return {
      message: 'OTP has been sent to your email address',
      // Remove this in production - only for testing
      otp
    };
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto) {
    const { email, code } = verifyOtpDto;

    const otp = await this.prisma.otp.findFirst({
      where: {
        email,
        code,
        isUsed: false,
        expiresAt: {
          gt: new Date(),
        },
      },
      include: {
        user: true,
      },
    });

    if (!otp) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    // Mark OTP as verified but not used yet (will be used when password is reset)
    return {
      message: 'OTP verified successfully',
      isValid: true,
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { email, code, newPassword } = resetPasswordDto;

    // Verify OTP again
    const otp = await this.prisma.otp.findFirst({
      where: {
        email,
        code,
        isUsed: false,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!otp) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 8);

    // Update password and mark OTP as used in a transaction
    await this.prisma.$transaction(async (prisma) => {
      // Update user password
      await prisma.user.update({
        where: { id: otp.userId },
        data: {
          password: hashedPassword,
        },
      });

      // Mark OTP as used
      await prisma.otp.update({
        where: { id: otp.id },
        data: {
          isUsed: true,
        },
      });

      // Revoke all existing tokens for this user
      await prisma.token.updateMany({
        where: {
          userId: otp.userId,
          isRevoked: false,
        },
        data: {
          isRevoked: true,
        },
      });
    });

    return {
      message: 'Password has been reset successfully. Please login with your new password.',
    };
  }
}