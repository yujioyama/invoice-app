import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import type { CreateInvoiceInput } from "../../../shared/types/Invoice";

export type CreateInvoiceDto = CreateInvoiceInput;

export interface UpdateInvoiceDto {
  name?: string;
  currency?: CreateInvoiceInput["currency"];
  language?: CreateInvoiceInput["language"];
  tasks?: Array<{ id?: string; name: string; rate: number; hours: number }>;
  clientId?: string | null;
}

@Injectable()
export class InvoicesService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateInvoiceDto) {
    const clientId = data.clientId ?? undefined;
    return this.prisma.invoice.create({
      data: {
        name: data.name,
        ...(data.currency ? { currency: data.currency } : {}),
        ...(data.language ? { language: data.language } : {}),
        userId: data.userId,
        ...(clientId ? { clientId } : {}),
        tasks: {
          create: data.tasks,
        },
      },
      include: { tasks: true, client: true },
    });
  }

  async findAll(userId: string) {
    return this.prisma.invoice.findMany({
      where: { userId },
      include: { tasks: true, client: true },
      orderBy: { createdAt: "desc" },
    });
  }

  async findOne(id: string, userId: string) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id },
      include: { tasks: true, client: true },
    });
    if (!invoice || invoice.userId !== userId) {
      throw new NotFoundException("Invoice not found");
    }
    return invoice;
  }

  async update(id: string, userId: string, data: UpdateInvoiceDto) {
    await this.findOne(id, userId);
    await this.prisma.task.deleteMany({ where: { invoiceId: id } });

    return this.prisma.invoice.update({
      where: { id },
      data: {
        name: data.name,
        ...(data.currency ? { currency: data.currency } : {}),
        ...(data.language ? { language: data.language } : {}),
        clientId: data.clientId ?? undefined,
        tasks: {
          create: data.tasks || [],
        },
      },
      include: { tasks: true, client: true },
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);
    return this.prisma.invoice.delete({
      where: { id },
    });
  }
}
