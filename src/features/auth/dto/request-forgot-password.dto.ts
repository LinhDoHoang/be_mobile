import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class RequestForgotPasswordDto {
  @ApiProperty({
    example: 'linh@gmail.com',
    description: "User's email",
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
