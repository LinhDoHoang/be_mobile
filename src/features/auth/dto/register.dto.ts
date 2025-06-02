import {
    IsEmail,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    Length,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class RegisterUserDto {
    @ApiProperty({
        example: 'user@example.com',
        description: "User's email",
    })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({
        example: 'Harry',
        description: "User's first name",
    })
    @IsNotEmpty()
    @IsString()
    firstName: string;

    @ApiProperty({
        example: 'Maguire',
        description: "User's last name",
    })
    @IsNotEmpty()
    @IsString()
    lastName: string;

    @ApiProperty({
        example: 'StrongPassword123',
        minLength: 6,
        description: 'Password must contain at least 6 characters',
    })
    @IsString()
    @Length(6, 255)
    password: string;

    @ApiProperty({
        example: 'StrongPassword123',
        minLength: 6,
        description: 'Password must contain at least 6 characters',
    })
    @IsString()
    @Length(6, 255)
    confirmPassword: string;
}
