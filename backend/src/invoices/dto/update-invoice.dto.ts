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

class UpdateTaskDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({ example: "Web Design" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 50 })
  @IsNumber()
  @Min(0)
  rate: number;

  @ApiProperty({ example: 10 })
  @IsNumber()
  @Min(0)
  hours: number;
}

export class UpdateInvoiceDto {
  @ApiProperty({ example: "Invoice #001", required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    example: "JPY",
    enum: ["JPY", "USD", "EUR", "GBP", "AUD"],
    required: false,
  })
  @IsOptional()
  @IsEnum(["JPY", "USD", "EUR", "GBP", "AUD"])
  currency?: Currency;

  @ApiProperty({ example: "ja", enum: ["en", "ja"], required: false })
  @IsOptional()
  @IsEnum(["en", "ja"])
  language?: InvoiceLanguage;

  @ApiProperty({ type: [UpdateTaskDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateTaskDto)
  tasks?: UpdateTaskDto[];

  @ApiProperty({ example: "client-id-123", required: false })
  @IsOptional()
  @IsString()
  clientId?: string | null;
}
