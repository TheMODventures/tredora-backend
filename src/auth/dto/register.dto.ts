import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsOptional, IsBoolean, IsNotEmpty } from 'class-validator';
import { Role } from 'generated/prisma';

export class RegisterDto {
  @ApiProperty({ example: 'ali@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'abc12345', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()

  fullName: string;

  @ApiProperty({ example: 'Acme Corporation' })
  @IsString()
  @IsNotEmpty()
  corporateName: string;

  @ApiProperty({ example: 'CEO', required: true })
  @IsString()
  @IsNotEmpty()
  designation: string;

  @ApiProperty({ example: 'johndoe' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: true, required: true })
  @IsString()
  @IsNotEmpty()
  role: Role;
}

