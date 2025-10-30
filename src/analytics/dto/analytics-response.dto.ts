import { ApiProperty } from '@nestjs/swagger';

export class AnalyticsResponseDto {
  @ApiProperty({
    description: 'Total number of users in the system',
    example: 150,
  })
  totalUsers: number;

  @ApiProperty({
    description: 'Total number of requests made',
    example: 1250,
  })
  totalRequests: number;

  @ApiProperty({
    description: 'Total number of form templates',
    example: 25,
  })
  totalTemplates: number;

  @ApiProperty({
    description: 'Total number of transactions (currently 0)',
    example: 0,
  })
  totalTransactions: number;
}
