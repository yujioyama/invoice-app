import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import type {
  CreateInvoiceInput,
  Invoice,
  Task,
} from "../../../shared/types/Invoice";

export type CreateInvoiceDto = CreateInvoiceInput;

export interface UpdateInvoiceDto {
  name?: string;
  tasks?: Array<{ id?: string; name: string; rate: number; hours: number }>;
}

@Injectable()
export class InvoicesService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateInvoiceDto) {
    return this.prisma.invoice.create({
      data: {
        name: data.name,
        userId: data.userId,
        tasks: {
          create: data.tasks,
        },
      },
      include: { tasks: true },
    });
  }

  async findAll() {
    return this.prisma.invoice.findMany({
      include: { tasks: true },
      orderBy: { createdAt: "desc" },
    });
  }

  async findOne(id: string) {
    return this.prisma.invoice.findUnique({
      where: { id },
      include: { tasks: true },
    });
  }

  async update(id: string, data: UpdateInvoiceDto) {
    // 既存のタスクを削除して新しいタスクを作成
    await this.prisma.task.deleteMany({ where: { invoiceId: id } });

    return this.prisma.invoice.update({
      where: { id },
      data: {
        name: data.name,
        tasks: {
          create: data.tasks || [],
        },
      },
      include: { tasks: true },
    });
  }

  async remove(id: string) {
    return this.prisma.invoice.delete({
      where: { id },
    });
  }
}
