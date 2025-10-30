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
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { RequestService } from './request.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth-guard';

@ApiTags('Requests')
@Controller('requests')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new request' })
  @ApiResponse({ status: 201, description: 'Request successfully created' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() createRequestDto: CreateRequestDto) {
    return this.requestService.create(createRequestDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all requests or filter by creator/formTemplate' })
  @ApiResponse({ status: 200, description: 'List of requests' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiQuery({ name: 'creatorId', required: false, description: 'Filter by creator ID' })
  @ApiQuery({ name: 'formTemplateId', required: false, description: 'Filter by form template ID' })
  findAll(
    @Query('creatorId') creatorId?: string,
    @Query('formTemplateId') formTemplateId?: string,
  ) {
    if (creatorId) {
      return this.requestService.findByCreator(creatorId);
    }
    if (formTemplateId) {
      return this.requestService.findByFormTemplate(formTemplateId);
    }
    return this.requestService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get request by ID' })
  @ApiResponse({ status: 200, description: 'Request details' })
  @ApiResponse({ status: 404, description: 'Request not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findOne(@Param('id') id: string) {
    return this.requestService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update request by ID' })
  @ApiResponse({ status: 200, description: 'Request successfully updated' })
  @ApiResponse({ status: 404, description: 'Request not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  update(@Param('id') id: string, @Body() updateRequestDto: UpdateRequestDto) {
    return this.requestService.update(id, updateRequestDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete request by ID' })
  @ApiResponse({ status: 200, description: 'Request successfully deleted' })
  @ApiResponse({ status: 404, description: 'Request not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  remove(@Param('id') id: string) {
    return this.requestService.remove(id);
  }
}
