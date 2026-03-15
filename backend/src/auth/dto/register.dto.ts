import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from "class-validator";

export class RegisterDto {
  @ApiProperty({
    example: "user@example.com",
    description: "email address of the user",
  })
  @IsEmail()
  email: string;

  @ApiProperty({ example: "John Doe", description: "name of the user" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: "password123", description: "password of the user" })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ example: "123 Main St", required: false })
  @IsOptional()
  @IsString()
  street?: string;

  @ApiProperty({ example: "New York", required: false })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ example: "NY", required: false })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiProperty({ example: "USA", required: false })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({ example: "10001", required: false })
  @IsOptional()
  @IsString()
  postalCode?: string;

  @ApiProperty({ example: "Bank of America", required: false })
  @IsOptional()
  @IsString()
  bank?: string;

  @ApiProperty({ example: "John Doe", required: false })
  @IsOptional()
  @IsString()
  accountName?: string;

  @ApiProperty({ example: "123456", required: false })
  @IsOptional()
  @IsString()
  branchCode?: string;

  @ApiProperty({ example: "1234567890", required: false })
  @IsOptional()
  @IsString()
  accountNumber?: string;

  @ApiProperty({ example: "BOFAUS3N", required: false })
  @IsOptional()
  @IsString()
  swiftBic?: string;

  @ApiProperty({ example: "123 Bank St", required: false })
  @IsOptional()
  @IsString()
  branchAddress?: string;

  @ApiProperty({ example: "USD", required: false })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiProperty({ example: "Intermediary Bank Name", required: false })
  @IsOptional()
  @IsString()
  intermediaryBank?: string;
}
