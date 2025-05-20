import { IsEmail, IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email của người dùng',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'StrongPassword123',
    minLength: 6,
    description: 'Mật khẩu (ít nhất 6 ký tự)',
  })
  @IsString()
  @Length(6, 255)
  password: string;

  @ApiProperty({
    example: 'refresh-token-value',
    required: false,
    description: 'Refresh token nếu có',
  })
  @IsOptional()
  @IsString()
  refreshToken?: string;

  @ApiProperty({
    example: 'user',
    enum: ['user', 'admin'],
    description: 'Vai trò của người dùng',
  })
  @IsEnum(['user', 'admin'])
  roles: 'user' | 'admin';
}
