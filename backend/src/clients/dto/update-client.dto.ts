import { ApiProperty } from "@nestjs/swagger";

export class UpdateClientDto {
  @ApiProperty({
    example: "Acme Corp",
    description: "client name",
    required: false,
  })
  name?: string;

  @ApiProperty({
    example: "123 Main St",
    description: "address",
    required: false,
  })
  address?: string;

  @ApiProperty({
    example: "Japan",
    description: "country",
    required: false,
  })
  country?: string;

  @ApiProperty({
    example: "acme@example.com",
    description: "email",
    required: false,
  })
  email?: string;

  @ApiProperty({
    example: "090-1234-5678",
    description: "phone",
    required: false,
  })
  phone?: string;
}
