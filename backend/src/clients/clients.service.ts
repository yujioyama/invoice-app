import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import type { CreateClientInput } from "@shared/types/Client";
import { UpdateClientDto } from "./dto/update-client.dto";

export type CreateClientDto = CreateClientInput;

@Injectable()
export class ClientsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateClientDto) {
    if (!data.userId) {
      throw new Error("userId is required");
    }

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

  async findOne(id: string) {
    return this.prisma.client.findUnique({
      where: { id },
    });
  }

  async update(id: string, data: UpdateClientDto) {
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

  async remove(id: string) {
    return this.prisma.client.delete({
      where: { id },
    });
  }
}
