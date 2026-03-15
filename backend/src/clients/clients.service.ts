import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import type { CreateClientInput } from "@shared/types/Client";
import { UpdateClientDto } from "./dto/update-client.dto";

export type CreateClientDto = CreateClientInput;

@Injectable()
export class ClientsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateClientDto) {
    return this.prisma.client.create({
      data: {
        name: data.name,
        userId: data.userId,
        email: data.email,
        phone: data.phone,
        address: data.address,
        country: data.country,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.client.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  async findOne(id: string, userId: string) {
    const client = await this.prisma.client.findUnique({
      where: { id },
    });
    if (!client || client.userId !== userId) {
      throw new NotFoundException("Client not found");
    }
    return client;
  }

  async update(id: string, userId: string, data: UpdateClientDto) {
    await this.findOne(id, userId);
    return this.prisma.client.update({
      where: { id },
      data: {
        name: data.name,
        address: data.address,
        email: data.email,
        phone: data.phone,
        country: data.country,
      },
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId); // Ensure the client exists and belongs to the user before deletion
    return this.prisma.client.delete({
      where: { id },
    });
  }
}
