import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFormTemplateDto } from './dto/create-form-template.dto';
import { UpdateFormTemplateDto } from './dto/update-form-template.dto';

@Injectable()
export class FormBuilderService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createFormTemplateDto: CreateFormTemplateDto) {
    const { fields, ...templateData } = createFormTemplateDto;

    const formTemplate = await this.prisma.formTemplate.create({
      data: {
        ...templateData,
        fields: {
          create: fields.map((field) => {
            const { options, validations, ...fieldData } = field;
            return {
              ...fieldData,
              options: options ? { create: options } : undefined,
              validations: validations ? { create: validations } : undefined,
            };
          }),
        },
      },
      include: {
        fields: {
          include: {
            options: true,
            validations: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    return formTemplate;
  }

  async findAll() {
    return this.prisma.formTemplate.findMany({
      include: {
        fields: {
          include: {
            options: {
              orderBy: {
                order: 'asc',
              },
            },
            validations: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const formTemplate = await this.prisma.formTemplate.findUnique({
      where: { id },
      include: {
        fields: {
          include: {
            options: {
              orderBy: {
                order: 'asc',
              },
            },
            validations: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    if (!formTemplate) {
      throw new NotFoundException(`Form template with ID ${id} not found`);
    }

    return formTemplate;
  }

  async update(id: string, updateFormTemplateDto: UpdateFormTemplateDto) {
    await this.findOne(id);

    const { fields, ...templateData } = updateFormTemplateDto;

    if (fields) {
      await this.prisma.formField.deleteMany({
        where: { templateId: id },
      });
    }

    const formTemplate = await this.prisma.formTemplate.update({
      where: { id },
      data: {
        ...templateData,
        ...(fields && {
          fields: {
            create: fields.map((field) => {
              const { options, validations, ...fieldData } = field;
              return {
                ...fieldData,
                options: options ? { create: options } : undefined,
                validations: validations ? { create: validations } : undefined,
              };
            }),
          },
        }),
      },
      include: {
        fields: {
          include: {
            options: {
              orderBy: {
                order: 'asc',
              },
            },
            validations: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    return formTemplate;
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.formTemplate.delete({
      where: { id },
    });

    return { message: 'Form template successfully deleted' };
  }
}
