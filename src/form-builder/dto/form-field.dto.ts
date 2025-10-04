import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum, IsOptional, IsInt, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { FieldType } from 'generated/prisma';
import { FieldOptionDto } from './field-option.dto';
import { FieldValidationDto } from './field-validation.dto';

export class FormFieldDto {
  @ApiProperty({ example: 'applicant_name' })
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty({ example: 'Applicant Name' })
  @IsString()
  @IsNotEmpty()
  label: string;

  @ApiProperty({ enum: FieldType, example: FieldType.TEXT })
  @IsEnum(FieldType)
  @IsNotEmpty()
  fieldType: FieldType;

  @ApiProperty({ example: 'Enter applicant name', required: false })
  @IsString()
  @IsOptional()
  placeholder?: string;

  @ApiProperty({ example: 'John Doe', required: false })
  @IsString()
  @IsOptional()
  defaultValue?: string;

  @ApiProperty({ example: 'John Doe', required: false })
  @IsString()
  @IsOptional()
  answer?: string;

  @ApiProperty({ example: 'Full legal name of the applicant', required: false })
  @IsString()
  @IsOptional()
  helpText?: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  order: number;

  @ApiProperty({ example: 'full', required: false })
  @IsString()
  @IsOptional()
  width?: string;

  @ApiProperty({ type: [FieldOptionDto], required: false })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FieldOptionDto)
  @IsOptional()
  options?: FieldOptionDto[];

  @ApiProperty({ type: [FieldValidationDto], required: false })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FieldValidationDto)
  @IsOptional()
  validations?: FieldValidationDto[];
}
