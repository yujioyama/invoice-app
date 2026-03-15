import { Test, TestingModule } from "@nestjs/testing";
import { ClientsService } from "./clients.service";
import { PrismaService } from "../prisma/prisma.service";
import { NotFoundException } from "@nestjs/common";

const mockPrismaService = {
  client: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    remove: jest.fn(),
  },
};

describe("ClientsService", () => {
  let service: ClientsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<ClientsService>(ClientsService);
    jest.clearAllMocks();
  });

  it("ClientsServiceが定義されている", () => {
    expect(service).toBeDefined();
  });

  describe("findAll", () => {
    it("ユーザーの全てのクライアントを取得できる", async () => {
      const mockClient = {
        id: "client-1",
        userId: "user-1",
        name: "Test Client",
        email: "test@example.com",
        phone: "123-456-7890",
      };
      mockPrismaService.client.findMany.mockResolvedValue([mockClient]);

      const result = await service.findAll("user-1");
      expect(result).toEqual([mockClient]);
      expect(mockPrismaService.client.findMany).toHaveBeenCalledWith({
        where: { userId: "user-1" },
        orderBy: { createdAt: "desc" },
      });
    });

    it("ユーザーにクライアントがない場合は空の配列を返す", async () => {
      mockPrismaService.client.findMany.mockResolvedValue([]);

      const result = await service.findAll("user-2");
      expect(result).toEqual([]);
      expect(mockPrismaService.client.findMany).toHaveBeenCalledWith({
        where: { userId: "user-2" },
        orderBy: { createdAt: "desc" },
      });
    });
  });

  describe("findOne", () => {
    it("IDでクライアントを取得できる", async () => {
      const mockClient = {
        id: "client-1",
        userId: "user-1",
        name: "Test Client",
        email: "test@example.com",
        phone: "123-456-7890",
      };
      mockPrismaService.client.findUnique.mockResolvedValue(mockClient);

      const result = await service.findOne("client-1", "user-1");
      expect(result).toEqual(mockClient);
      expect(mockPrismaService.client.findUnique).toHaveBeenCalledWith({
        where: { id: "client-1" },
      });
    });

    it("存在しないIDの場合はNotFoundExceptionを投げる", async () => {
      mockPrismaService.client.findUnique.mockResolvedValue(null);

      await expect(
        service.findOne("non-existent-id", "user-1"),
      ).rejects.toThrow(NotFoundException);
    });

    it("他のユーザーのクライアントはNotFoundExceptionを投げる", async () => {
      const mockClient = {
        id: "client-1",
        userId: "user-2",
        name: "Test Client",
      };
      mockPrismaService.client.findUnique.mockResolvedValue(mockClient);

      await expect(service.findOne("client-1", "user-1")).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe("remove", () => {
    it("IDでクライアントを削除できる", async () => {
      const mockClient = {
        id: "client-1",
        userId: "user-1",
        name: "Test Client",
        email: "test@example.com",
        phone: "123-456-7890",
      };
      mockPrismaService.client.findUnique.mockResolvedValue(mockClient);
      mockPrismaService.client.delete.mockResolvedValue(mockClient);

      const result = await service.remove("client-1", "user-1");
      expect(result).toEqual(mockClient);
      expect(mockPrismaService.client.delete).toHaveBeenCalledWith({
        where: { id: "client-1" },
      });
    });
  });
});
