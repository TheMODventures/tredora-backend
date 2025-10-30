import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateRequestDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'User ID of the request creator' })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  creatorId: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174001', description: 'Form template ID' })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  formTemplateId: string;
}
