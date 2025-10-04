import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { ValidationRuleType } from 'generated/prisma';

export class FieldValidationDto {
  @ApiProperty({ enum: ValidationRuleType, example: ValidationRuleType.REQUIRED })
  @IsEnum(ValidationRuleType)
  @IsNotEmpty()
  ruleType: ValidationRuleType;

  @ApiProperty({ example: '5', required: false })
  @IsString()
  @IsOptional()
  value?: string;

  @ApiProperty({ example: 'This field is required' })
  @IsString()
  @IsNotEmpty()
  errorMessage: string;
}
