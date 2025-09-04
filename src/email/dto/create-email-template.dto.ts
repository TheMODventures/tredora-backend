import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEmailTemplateDto {
  @ApiProperty({ example: 'forgot-password', description: 'Unique key for the email template' })
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty({ example: 'Reset Your Password', description: 'Email subject line' })
  @IsString()
  @IsNotEmpty()
  subject: string;

  @ApiProperty({ 
    example: 'Hello {{name}}, please use this OTP: {{otp}} to reset your password.', 
    description: 'Email content with template variables' 
  })
  @IsString()
  @IsNotEmpty()
  content: string;
}