import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AnalyticsResponseDto } from './dto/analytics-response.dto';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAnalytics(): Promise<AnalyticsResponseDto> {
    const [totalUsers, totalRequests, totalTemplates] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.request.count(),
      this.prisma.formTemplate.count(),
    ]);

    return {
      totalUsers,
      totalRequests,
      totalTemplates,
      totalTransactions: 0, 
    };
  }
}