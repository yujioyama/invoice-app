import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateClientDto {
  userId: string; // This is required for creating a client, but we won't expose it in the API docs

  @ApiProperty({ example: "Acme Corp", description: "client name" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: "123 Main St", description: "address" })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ example: "Japan", description: "country" })
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiProperty({
    example: "acme@example.com",
    description: "email",
    required: false,
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    example: "090-1234-5678",
    description: "phone",
    required: false,
  })
  @IsString()
  @IsOptional()
  phone?: string;
}
