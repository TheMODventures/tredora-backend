import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { BankService } from './bank.service';
import { CreateBankDto } from './dto/create-bank.dto';
import { UpdateBankDto } from './dto/update-bank.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth-guard';

@ApiTags('Banks')
@Controller('banks')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class BankController {
  constructor(private readonly bankService: BankService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new bank' })
  @ApiResponse({ status: 201, description: 'Bank successfully created' })
  @ApiResponse({ status: 409, description: 'Bank with this SWIFT code already exists' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() createBankDto: CreateBankDto) {
    return this.bankService.create(createBankDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all banks' })
  @ApiResponse({ status: 200, description: 'List of all banks' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll() {
    return this.bankService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get bank by ID' })
  @ApiResponse({ status: 200, description: 'Bank details' })
  @ApiResponse({ status: 404, description: 'Bank not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findOne(@Param('id') id: string) {
    return this.bankService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update bank by ID' })
  @ApiResponse({ status: 200, description: 'Bank successfully updated' })
  @ApiResponse({ status: 404, description: 'Bank not found' })
  @ApiResponse({ status: 409, description: 'Bank with this SWIFT code already exists' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  update(@Param('id') id: string, @Body() updateBankDto: UpdateBankDto) {
    return this.bankService.update(id, updateBankDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete bank by ID' })
  @ApiResponse({ status: 200, description: 'Bank successfully deleted' })
  @ApiResponse({ status: 404, description: 'Bank not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  remove(@Param('id') id: string) {
    return this.bankService.remove(id);
  }
}
