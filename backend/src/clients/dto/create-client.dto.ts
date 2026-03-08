import { ApiProperty } from "@nestjs/swagger";

export class CreateClientDto {
  userId: string; // This is required for creating a client, but we won't expose it in the API docs

  @ApiProperty({ example: "Acme Corp", description: "client name" })
  name: string;

  @ApiProperty({ example: "123 Main St", description: "address" })
  address: string;

  @ApiProperty({ example: "Japan", description: "country" })
  country: string;

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
