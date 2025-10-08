import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChatSupportRequestDto {
  @ApiProperty({
    description: 'Natural language description of trade requirement',
    example: 'I need to create a Letter of Credit application form for importing textiles from China',
  })
  @IsString()
  @IsNotEmpty()
  message: string;
}

export class RequirementAnalysisRequestDto {
  @ApiProperty({
    description: 'User requirement in natural language',
    example: 'Create a risk assessment form for evaluating new trade partners',
  })
  @IsString()
  @IsNotEmpty()
  userRequirement: string;

  @ApiProperty({
    description: 'Optional trade type to help guide form generation',
    example: 'Letter of Credit',
    required: false,
  })
  @IsString()
  @IsOptional()
  tradeType?: string;
}
