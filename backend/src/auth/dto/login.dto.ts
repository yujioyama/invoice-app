// dto - Data Transfer Object
import { ApiProperty } from "@nestjs/swagger";
export class LoginDto {
  @ApiProperty({
    example: "user@example.com",
    description: "email address of the user",
  })
  email: string;
  @ApiProperty({
    example: "password123",
    description: "password of the user",
  })
  password: string;
}
