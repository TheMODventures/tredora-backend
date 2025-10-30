import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';

@Injectable()
export class RequestService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createRequestDto: CreateRequestDto) {
    const request = await this.prisma.request.create({
      data: createRequestDto,
      include: {
        creator: {
          select: {
            id: true,
            email: true,
            username: true,
          },
        },
        formTemplate: {
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
        },
      },
    });

    return request;
  }

  async findAll() {
    return this.prisma.request.findMany({
      include: {
        creator: {
          select: {
            id: true,
            email: true,
            username: true,
          },
        },
        formTemplate: {
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
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const request = await this.prisma.request.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            email: true,
            username: true,
          },
        },
        formTemplate: {
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
        },
      },
    });

    if (!request) {
      throw new NotFoundException(`Request with ID ${id} not found`);
    }

    return request;
  }

  async findByCreator(creatorId: string) {
    return this.prisma.request.findMany({
      where: { creatorId },
      include: {
        creator: {
          select: {
            id: true,
            email: true,
            username: true,
          },
        },
        formTemplate: {
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
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findByFormTemplate(formTemplateId: string) {
    return this.prisma.request.findMany({
      where: { formTemplateId },
      include: {
        creator: {
          select: {
            id: true,
            email: true,
            username: true,
          },
        },
        formTemplate: {
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
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async update(id: string, updateRequestDto: UpdateRequestDto) {
    await this.findOne(id);

    const request = await this.prisma.request.update({
      where: { id },
      data: updateRequestDto,
      include: {
        creator: {
          select: {
            id: true,
            email: true,
            username: true,
          },
        },
        formTemplate: {
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
        },
      },
    });

    return request;
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.request.delete({
      where: { id },
    });

    return { message: 'Request successfully deleted' };
  }
}
