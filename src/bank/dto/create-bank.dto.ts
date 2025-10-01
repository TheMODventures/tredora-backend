import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsArray, ValidateNested, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { BankType } from 'generated/prisma';

export class ContactDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '+1234567890' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: 'john@bank.com' })
  @IsString()
  @IsNotEmpty()
  email: string;
}

export class CreateBankDto {
  @ApiProperty({ example: 'United States' })
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiProperty({ example: 'New York' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ example: 'Bank of America' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'BOFAUS3N' })
  @IsString()
  @IsNotEmpty()
  swiftCode: string;

  @ApiProperty({ enum: BankType, example: BankType.CONFIRMING })
  @IsEnum(BankType)
  @IsNotEmpty()
  type: BankType;

  @ApiProperty({ type: [ContactDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContactDto)
  contacts: ContactDto[];
}
