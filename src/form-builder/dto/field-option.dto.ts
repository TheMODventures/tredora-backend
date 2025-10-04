import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsInt, IsBoolean, IsOptional } from 'class-validator';

export class FieldOptionDto {
  @ApiProperty({ example: 'Yes' })
  @IsString()
  @IsNotEmpty()
  label: string;

  @ApiProperty({ example: 'yes' })
  @IsString()
  @IsNotEmpty()
  value: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  order: number;

  @ApiProperty({ example: false, required: false })
  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;
}
