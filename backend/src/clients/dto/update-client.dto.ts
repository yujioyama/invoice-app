import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString } from "class-validator";

export class UpdateClientDto {
  @ApiProperty({ example: "Acme Corp", description: "client name", required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: "123 Main St", description: "address", required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ example: "Japan", description: "country", required: false })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({ example: "acme@example.com", description: "email", required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: "090-1234-5678", description: "phone", required: false })
  @IsOptional()
  @IsString()
  phone?: string;
}
