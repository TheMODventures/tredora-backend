import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { EmailService } from './email.service';
import { CreateEmailTemplateDto } from './dto/create-email-template.dto';
import { UpdateEmailTemplateDto } from './dto/update-email-template.dto';

@ApiTags('Email Templates')
@Controller('email-templates')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new email template' })
  @ApiResponse({ status: 201, description: 'Email template created successfully' })
  @ApiResponse({ status: 409, description: 'Email template with this key already exists' })
  create(@Body() createEmailTemplateDto: CreateEmailTemplateDto) {
    return this.emailService.create(createEmailTemplateDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all email templates' })
  @ApiResponse({ status: 200, description: 'List of email templates' })
  findAll() {
    return this.emailService.findAll();
  }

  @Get('by-key/:key')
  @ApiOperation({ summary: 'Get email template by key' })
  @ApiParam({ name: 'key', description: 'Email template key' })
  @ApiResponse({ status: 200, description: 'Email template found' })
  @ApiResponse({ status: 404, description: 'Email template not found' })
  findByKey(@Param('key') key: string) {
    return this.emailService.findByKey(key);
  }

  @Get('render/:key')
  @ApiOperation({ summary: 'Render email template with variables' })
  @ApiParam({ name: 'key', description: 'Email template key' })
  @ApiQuery({ name: 'variables', required: false, description: 'JSON string of template variables' })
  @ApiResponse({ status: 200, description: 'Rendered email template' })
  @ApiResponse({ status: 404, description: 'Email template not found' })
  async renderTemplate(
    @Param('key') key: string,
    @Query('variables') variablesJson?: string,
  ) {
    let variables = {};
    if (variablesJson) {
      try {
        variables = JSON.parse(variablesJson);
      } catch (error) {
        variables = {};
      }
    }
    return this.emailService.renderTemplate(key, variables);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get email template by ID' })
  @ApiParam({ name: 'id', description: 'Email template ID' })
  @ApiResponse({ status: 200, description: 'Email template found' })
  @ApiResponse({ status: 404, description: 'Email template not found' })
  findOne(@Param('id') id: string) {
    return this.emailService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update email template' })
  @ApiParam({ name: 'id', description: 'Email template ID' })
  @ApiResponse({ status: 200, description: 'Email template updated successfully' })
  @ApiResponse({ status: 404, description: 'Email template not found' })
  @ApiResponse({ status: 409, description: 'Email template key already exists' })
  update(@Param('id') id: string, @Body() updateEmailTemplateDto: UpdateEmailTemplateDto) {
    return this.emailService.update(id, updateEmailTemplateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete email template' })
  @ApiParam({ name: 'id', description: 'Email template ID' })
  @ApiResponse({ status: 200, description: 'Email template deleted successfully' })
  @ApiResponse({ status: 404, description: 'Email template not found' })
  remove(@Param('id') id: string) {
    return this.emailService.remove(id);
  }
}