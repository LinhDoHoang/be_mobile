import { Exclude, Expose } from 'class-transformer';

export class UserResponseDto {
  @Expose()
  id: number;

  @Expose()
  target: number;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  email: string;

  @Expose()
  createdAt: Date;

  @Exclude()
  password: string;

  @Exclude()
  tempPassword: string;

  @Exclude()
  refreshToken: string;
}
