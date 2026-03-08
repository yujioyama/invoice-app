import { ApiProperty } from "@nestjs/swagger";
import type { Currency, InvoiceLanguage } from "@shared/types/Invoice";

class UpdateTaskDto {
  @ApiProperty({ required: false })
  id?: string;

  @ApiProperty({ example: "Web Design" })
  name: string;

  @ApiProperty({ example: 50 })
  rate: number;

  @ApiProperty({ example: 10 })
  hours: number;
}

export class UpdateInvoiceDto {
  @ApiProperty({ example: "Invoice #001", required: false })
  name?: string;

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

  @ApiProperty({ type: [UpdateTaskDto], required: false })
  tasks?: UpdateTaskDto[];

  @ApiProperty({ example: "client-id-123", required: false })
  clientId?: string | null;
}
