import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TokenService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async generateTokens(user: string, email: string) {
    const payload = { sub: user, email };
    
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: this.configService.get('JWT_EXPIRATION', '15m'),
        secret: this.configService.get('JWT_SECRET'),
      }),
      this.jwtService.signAsync(payload, {
        expiresIn: '7d',
        secret: this.configService.get('JWT_SECRET'),
      }),
    ]);

    return { accessToken, refreshToken };
  }

  async saveTokens(user: string, accessToken: string, refreshToken: string) {
    // Remove old tokens for this user
    await this.prisma.token.deleteMany({
      where: { userId: user },
    });

    // Calculate expiration date
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days for refresh token

    // Save new tokens
    return this.prisma.token.create({
      data: {
        userId: user,
        accessToken,
        refreshToken,
        expiresAt,
      },
    });
  }

  async refreshTokens(refreshToken: string) {
    // Find token in database
    const tokenData = await this.prisma.token.findUnique({
      where: { refreshToken },
      include: { user: true },
    });

    if (!tokenData) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Check if token is expired
    if (tokenData.expiresAt < new Date()) {
      await this.prisma.token.delete({
        where: { id: tokenData.id },
      });
      throw new UnauthorizedException('Refresh token expired');
    }

    // Generate new tokens
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = 
      await this.generateTokens(tokenData.user.id, tokenData.user.email);
    
    // Update tokens in database
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    
    await this.prisma.token.update({
      where: { id: tokenData.id },
      data: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        expiresAt,
      },
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      user: {
        id: tokenData.user.id,
        email: tokenData.user.email,
      },
    };
  }

  async validateAccessToken(accessToken: string) {
    const token = await this.prisma.token.findUnique({
      where: { accessToken },
      include: { user: true },
    });

    if (!token || token.expiresAt < new Date()) {
      return null;
    }

    return token.user;
  }

  async revokeTokens(user: string) {
    return this.prisma.token.deleteMany({
      where: { userId: user },
    });
  }

  async revokeToken(tokenId: string) {
    return this.prisma.token.delete({
      where: { id: tokenId },
    });
  }

  async getUserTokens(user: string) {
    return this.prisma.token.findMany({
      where: { userId: user },
      select: {
        id: true,
        createdAt: true,
        expiresAt: true,
      },
    });
  }

  async cleanExpiredTokens() {
    return this.prisma.token.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
  }
}