import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { AnalyticsResponseDto } from './dto/analytics-response.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth-guard';

@ApiTags('Analytics')
@Controller('analytics')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get system analytics',
    description: 'Returns analytics data including total users, requests, templates, and transactions'
  })
  @ApiResponse({
    status: 200,
    description: 'Analytics data retrieved successfully',
    type: AnalyticsResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async getAnalytics(): Promise<AnalyticsResponseDto> {
    return this.analyticsService.getAnalytics();
  }
}
