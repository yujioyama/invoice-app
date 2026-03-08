import { Test, TestingModule } from "@nestjs/testing";
import { InvoicesService } from "./invoices.service";
import { PrismaService } from "../prisma/prisma.service";

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
    // findAllのテストケースをここに書く
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
    // findOneのテストケースをここに書く
    it("IDで請求書を取得できる", async () => {
      const mockInvoice = {
        id: "invoice-1",
        userId: "user-1",
        title: "Test Invoice",
        amount: 1000,
        dueDate: new Date(),
      };
      mockPrismaService.invoice.findUnique.mockResolvedValue(mockInvoice);

      const result = await service.findOne("invoice-1");
      expect(result).toEqual(mockInvoice);
      expect(mockPrismaService.invoice.findUnique).toHaveBeenCalledWith({
        where: { id: "invoice-1" },
        include: { tasks: true, client: true },
      });
    });

    it("存在しないIDの場合はnullを返す", async () => {
      mockPrismaService.invoice.findUnique.mockResolvedValue(null);

      const result = await service.findOne("non-existent-id");
      expect(result).toBeNull();
      expect(mockPrismaService.invoice.findUnique).toHaveBeenCalledWith({
        where: { id: "non-existent-id" },
        include: { tasks: true, client: true },
      });
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
      mockPrismaService.invoice.delete.mockResolvedValue(mockInvoice);

      const result = await service.remove("invoice-1");
      expect(result).toEqual(mockInvoice);
      expect(mockPrismaService.invoice.delete).toHaveBeenCalledWith({
        where: { id: "invoice-1" },
      });
    });
  });
});
