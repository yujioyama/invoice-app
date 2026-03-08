import { ApiProperty } from "@nestjs/swagger";
export class RegisterDto {
  @ApiProperty({
    example: "user@example.com",
    description: "email address of the user",
  })
  email: string;
  @ApiProperty({
    example: "John Doe",
    description: "name of the user",
  })
  name: string;
  @ApiProperty({
    example: "password123",
    description: "password of the user",
  })
  password: string;
  @ApiProperty({
    example: "123 Main St",
    description: "street address of the user",
    required: false,
  })
  street?: string;
  @ApiProperty({
    example: "New York",
    description: "city of the user",
    required: false,
  })
  city?: string;
  @ApiProperty({
    example: "NY",
    description: "state of the user",
    required: false,
  })
  state?: string;
  @ApiProperty({
    example: "USA",
    description: "country of the user",
    required: false,
  })
  country?: string;
  @ApiProperty({
    example: "10001",
    description: "postal code of the user",
    required: false,
  })
  postalCode?: string;
  @ApiProperty({
    example: "Bank of America",
    description: "bank name of the user",
    required: false,
  })
  bank?: string;
  @ApiProperty({
    example: "John Doe",
    description: "account name of the user",
    required: false,
  })
  accountName?: string;
  @ApiProperty({
    example: "123456",
    description: "branch code of the user's bank",
    required: false,
  })
  branchCode?: string;
  @ApiProperty({
    example: "1234567890",
    description: "account number of the user",
    required: false,
  })
  accountNumber?: string;
  @ApiProperty({
    example: "BOFAUS3N",
    description: "SWIFT/BIC code of the user's bank",
    required: false,
  })
  swiftBic?: string;
  @ApiProperty({
    example: "123 Bank St, New York, NY 10001",
    description: "branch address of the user's bank",
    required: false,
  })
  branchAddress?: string;
  @ApiProperty({
    example: "USD",
    description: "currency of the user's bank account",
    required: false,
  })
  currency?: string;
  @ApiProperty({
    example: "Intermediary Bank Name",
    description: "intermediary bank of the user's bank account",
    required: false,
  })
  intermediaryBank?: string;
}
