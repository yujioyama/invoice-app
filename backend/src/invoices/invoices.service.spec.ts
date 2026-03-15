import { Test, TestingModule } from "@nestjs/testing";
import { InvoicesService } from "./invoices.service";
import { PrismaService } from "../prisma/prisma.service";
import { NotFoundException } from "@nestjs/common";

const mockPrismaService = {
  invoice: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  task: {
    deleteMany: jest.fn(),
  },
};

describe("InvoicesService", () => {
  let service: InvoicesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvoicesService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<InvoicesService>(InvoicesService);
    jest.clearAllMocks();
  });

  it("InvoicesServiceが定義されている", () => {
    expect(service).toBeDefined();
  });

  describe("findAll", () => {
    it("ユーザーの全ての請求書を取得できる", async () => {
      const mockInvoice = {
        id: "invoice-1",
        userId: "user-1",
        title: "Test Invoice",
        amount: 1000,
        dueDate: new Date(),
      };
      mockPrismaService.invoice.findMany.mockResolvedValue([mockInvoice]);

      const result = await service.findAll("user-1");
      expect(result).toEqual([mockInvoice]);
      expect(mockPrismaService.invoice.findMany).toHaveBeenCalledWith({
        where: { userId: "user-1" },
        include: { tasks: true, client: true },
        orderBy: { createdAt: "desc" },
      });
    });

    it("ユーザーに請求書がない場合は空の配列を返す", async () => {
      mockPrismaService.invoice.findMany.mockResolvedValue([]);

      const result = await service.findAll("user-2");
      expect(result).toEqual([]);
      expect(mockPrismaService.invoice.findMany).toHaveBeenCalledWith({
        where: { userId: "user-2" },
        include: { tasks: true, client: true },
        orderBy: { createdAt: "desc" },
      });
    });
  });

  describe("findOne", () => {
    it("IDで請求書を取得できる", async () => {
      const mockInvoice = {
        id: "invoice-1",
        userId: "user-1",
        title: "Test Invoice",
        amount: 1000,
        dueDate: new Date(),
      };
      mockPrismaService.invoice.findUnique.mockResolvedValue(mockInvoice);

      const result = await service.findOne("invoice-1", "user-1");
      expect(result).toEqual(mockInvoice);
      expect(mockPrismaService.invoice.findUnique).toHaveBeenCalledWith({
        where: { id: "invoice-1" },
        include: { tasks: true, client: true },
      });
    });

    it("存在しないIDの場合はNotFoundExceptionを投げる", async () => {
      mockPrismaService.invoice.findUnique.mockResolvedValue(null);

      await expect(
        service.findOne("non-existent-id", "user-1"),
      ).rejects.toThrow(NotFoundException);
    });

    it("他のユーザーの請求書はNotFoundExceptionを投げる", async () => {
      const mockInvoice = {
        id: "invoice-1",
        userId: "user-2",
        title: "Test Invoice",
      };
      mockPrismaService.invoice.findUnique.mockResolvedValue(mockInvoice);

      await expect(service.findOne("invoice-1", "user-1")).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe("remove", () => {
    it("IDで請求書を削除できる", async () => {
      const mockInvoice = {
        id: "invoice-1",
        userId: "user-1",
        title: "Test Invoice",
        amount: 1000,
        dueDate: new Date(),
      };
      mockPrismaService.invoice.findUnique.mockResolvedValue(mockInvoice);
      mockPrismaService.invoice.delete.mockResolvedValue(mockInvoice);

      const result = await service.remove("invoice-1", "user-1");
      expect(result).toEqual(mockInvoice);
      expect(mockPrismaService.invoice.delete).toHaveBeenCalledWith({
        where: { id: "invoice-1" },
      });
    });
  });

  describe("update", () => {
    it("既存のタスクを削除してから請求書を更新する", async () => {
      const mockInvoice = {
        id: "invoice-1",
        userId: "user-1",
        title: "Test Invoice",
      };
      mockPrismaService.invoice.findUnique.mockResolvedValue(mockInvoice);
      mockPrismaService.task.deleteMany.mockResolvedValue({ count: 1 });

      const mockUpdatedInvoice = {
        id: "invoice-1",
        userId: "user-1",
        title: "Updated Invoice",
        tasks: [
          {
            id: "task-1",
            invoiceId: "invoice-1",
            name: "Task 1",
            rate: 27,
            hours: 1,
          },
        ],
      };
      mockPrismaService.invoice.update.mockResolvedValue(mockUpdatedInvoice);

      const result = await service.update("invoice-1", "user-1", {
        name: "Updated Invoice",
        clientId: "client-1",
        tasks: [{ name: "Task 1", rate: 27, hours: 1 }],
      });

      expect(mockPrismaService.task.deleteMany).toHaveBeenCalledWith({
        where: { invoiceId: "invoice-1" },
      });
      expect(mockPrismaService.invoice.update).toHaveBeenCalledWith({
        where: { id: "invoice-1" },
        data: {
          name: "Updated Invoice",
          clientId: "client-1",
          tasks: { create: [{ name: "Task 1", rate: 27, hours: 1 }] },
        },
        include: { tasks: true, client: true },
      });
      expect(result).toEqual(mockUpdatedInvoice);
    });
  });
});
