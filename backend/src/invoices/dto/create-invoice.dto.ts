import { ApiProperty } from "@nestjs/swagger";
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import type { Currency, InvoiceLanguage } from "@shared/types/Invoice";

class TaskDto {
  @ApiProperty({ example: "Web Design", description: "task name" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 50, description: "hourly rate" })
  @IsNumber()
  @Min(0)
  rate: number;

  @ApiProperty({ example: 10, description: "hours worked" })
  @IsNumber()
  @Min(0)
  hours: number;
}

export class CreateInvoiceDto {
  @ApiProperty({ example: "Invoice #001", description: "invoice name" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: "user-id-123", description: "user ID" })
  @IsString()
  userId: string;

  @ApiProperty({ type: [TaskDto], description: "task list" })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TaskDto)
  tasks: TaskDto[];

  @ApiProperty({
    example: "JPY",
    enum: ["JPY", "USD", "EUR", "GBP", "AUD"],
    required: false,
  })
  @IsOptional()
  @IsEnum(["JPY", "USD", "EUR", "GBP", "AUD"])
  currency?: Currency;

  @ApiProperty({
    example: "ja",
    enum: ["en", "ja"],
    required: false,
  })
  @IsOptional()
  @IsEnum(["en", "ja"])
  language?: InvoiceLanguage;

  @ApiProperty({ example: "client-id-123", required: false })
  @IsOptional()
  @IsString()
  clientId?: string | null;
}
