import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    description: 'Email',
    example: 'linh@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Current password',
    example: 'linhdeptrai',
  })
  @IsNotEmpty()
  @Length(6, 50)
  @IsString()
  currentPassword: string;

  @ApiProperty({
    description: 'New password',
    example: 'linhdeptrai',
  })
  @IsNotEmpty()
  @Length(6, 50)
  @IsString()
  newPassword: string;

  @ApiProperty({
    description: 'Confirm password',
    example: 'linhdeptrai',
  })
  @IsNotEmpty()
  @IsString()
  confirmPassword: string;
}
