import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ContactDto } from './create-bank.dto';

export class AddContactDto {
  @ApiProperty({
    type: [ContactDto],
    description: 'Array of contacts to add to the bank'
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContactDto)
  contacts: ContactDto[];
}
