import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBankDto } from './dto/create-bank.dto';
import { UpdateBankDto } from './dto/update-bank.dto';

@Injectable()
export class BankService {
  constructor(private prisma: PrismaService) {}

  async create(createBankDto: CreateBankDto) {
    const { contacts, ...bankData } = createBankDto;

    // Check if swift code already exists
    const existingBank = await this.prisma.bank.findUnique({
      where: { swiftCode: bankData.swiftCode },
    });

    if (existingBank) {
      throw new ConflictException('Bank with this SWIFT code already exists');
    }

    return this.prisma.bank.create({
      data: {
        ...bankData,
        contacts: {
          create: contacts,
        },
      },
      include: {
        contacts: true,
      },
    });
  }

  async findAll() {
    return this.prisma.bank.findMany({
      include: {
        contacts: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const bank = await this.prisma.bank.findUnique({
      where: { id },
      include: {
        contacts: true,
      },
    });

    if (!bank) {
      throw new NotFoundException('Bank not found');
    }

    return bank;
  }

  async update(id: string, updateBankDto: UpdateBankDto) {
    const { contacts, ...bankData } = updateBankDto;

    // Check if bank exists
    const existingBank = await this.prisma.bank.findUnique({
      where: { id },
    });

    if (!existingBank) {
      throw new NotFoundException('Bank not found');
    }

    // If updating swift code, check it doesn't conflict
    if (bankData.swiftCode && bankData.swiftCode !== existingBank.swiftCode) {
      const swiftExists = await this.prisma.bank.findUnique({
        where: { swiftCode: bankData.swiftCode },
      });

      if (swiftExists) {
        throw new ConflictException('Bank with this SWIFT code already exists');
      }
    }

    return this.prisma.bank.update({
      where: { id },
      data: {
        ...bankData,
        ...(contacts && {
          contacts: {
            deleteMany: {},
            create: contacts,
          },
        }),
      },
      include: {
        contacts: true,
      },
    });
  }

  async remove(id: string) {
    const bank = await this.prisma.bank.findUnique({
      where: { id },
    });

    if (!bank) {
      throw new NotFoundException('Bank not found');
    }

    await this.prisma.bank.delete({
      where: { id },
    });

    return { message: 'Bank deleted successfully' };
  }
}
