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
import { FormBuilderService } from './form-builder.service';
import { CreateFormTemplateDto } from './dto/create-form-template.dto';
import { UpdateFormTemplateDto } from './dto/update-form-template.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth-guard';

@ApiTags('Form Builder')
@Controller('form-templates')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class FormBuilderController {
  constructor(private readonly formBuilderService: FormBuilderService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new form template' })
  @ApiResponse({ status: 201, description: 'Form template successfully created' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() createFormTemplateDto: CreateFormTemplateDto) {
    return this.formBuilderService.create(createFormTemplateDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all form templates' })
  @ApiResponse({ status: 200, description: 'List of all form templates' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll() {
    return this.formBuilderService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get form template by ID' })
  @ApiResponse({ status: 200, description: 'Form template details' })
  @ApiResponse({ status: 404, description: 'Form template not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findOne(@Param('id') id: string) {
    return this.formBuilderService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update form template by ID' })
  @ApiResponse({ status: 200, description: 'Form template successfully updated' })
  @ApiResponse({ status: 404, description: 'Form template not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  update(@Param('id') id: string, @Body() updateFormTemplateDto: UpdateFormTemplateDto) {
    return this.formBuilderService.update(id, updateFormTemplateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete form template by ID' })
  @ApiResponse({ status: 200, description: 'Form template successfully deleted' })
  @ApiResponse({ status: 404, description: 'Form template not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  remove(@Param('id') id: string) {
    return this.formBuilderService.remove(id);
  }
}
