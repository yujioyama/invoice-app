import { ApiProperty } from "@nestjs/swagger";
import type { Currency, InvoiceLanguage } from "@shared/types/Invoice";

class TaskDto {
  @ApiProperty({ example: "Web Design", description: "task name" })
  name: string;

  @ApiProperty({ example: 50, description: "hourly rate" })
  rate: number;

  @ApiProperty({ example: 10, description: "hours worked" })
  hours: number;
}

export class CreateInvoiceDto {
  @ApiProperty({ example: "Invoice #001", description: "invoice name" })
  name: string;

  @ApiProperty({ example: "user-id-123", description: "user ID" })
  userId: string;

  @ApiProperty({ type: [TaskDto], description: "task list" })
  tasks: TaskDto[];

  @ApiProperty({
    example: "JPY",
    enum: ["JPY", "USD", "EUR", "GBP", "AUD"],
    required: false,
  })
  currency?: Currency;

  @ApiProperty({
    example: "ja",
    enum: ["en", "ja"],
    required: false,
  })
  language?: InvoiceLanguage;

  @ApiProperty({ example: "client-id-123", required: false })
  clientId?: string | null;
}
