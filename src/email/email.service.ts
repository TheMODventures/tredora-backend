import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEmailTemplateDto } from './dto/create-email-template.dto';
import { UpdateEmailTemplateDto } from './dto/update-email-template.dto';

@Injectable()
export class EmailService {
  constructor(private prisma: PrismaService) {}

  async create(createEmailTemplateDto: CreateEmailTemplateDto) {
    const { key, subject, content } = createEmailTemplateDto;

    const existingTemplate = await this.prisma.emailTemplate.findUnique({
      where: { key },
    });

    if (existingTemplate) {
      throw new ConflictException(`Email template with key '${key}' already exists`);
    }

    return this.prisma.emailTemplate.create({
      data: {
        key,
        subject,
        content,
      },
    });
  }

  async findAll() {
    return this.prisma.emailTemplate.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const template = await this.prisma.emailTemplate.findUnique({
      where: { id },
    });

    if (!template) {
      throw new NotFoundException(`Email template with ID '${id}' not found`);
    }

    return template;
  }

  async findByKey(key: string) {
    const template = await this.prisma.emailTemplate.findUnique({
      where: { key },
    });

    if (!template) {
      throw new NotFoundException(`Email template with key '${key}' not found`);
    }

    return template;
  }

  async update(id: string, updateEmailTemplateDto: UpdateEmailTemplateDto) {
    const existingTemplate = await this.findOne(id);

    if (updateEmailTemplateDto.key && updateEmailTemplateDto.key !== existingTemplate.key) {
      const keyExists = await this.prisma.emailTemplate.findUnique({
        where: { key: updateEmailTemplateDto.key },
      });

      if (keyExists) {
        throw new ConflictException(`Email template with key '${updateEmailTemplateDto.key}' already exists`);
      }
    }

    return this.prisma.emailTemplate.update({
      where: { id },
      data: updateEmailTemplateDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.emailTemplate.delete({
      where: { id },
    });

    return { message: 'Email template deleted successfully' };
  }

}