import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'password',
    example: 'linhdeptrai',
  })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({
    description: 'email',
    example: 'linh@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
