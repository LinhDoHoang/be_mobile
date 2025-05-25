import { Exclude, Expose } from 'class-transformer';

export class UserResponseDto {
  @Expose()
  id: number;

  @Exclude()
  password: string;

  @Exclude()
  tempPassword: string;

  @Expose()
  target: number;

  @Expose()
  email: string;

  @Exclude()
  refreshToken: string;
}
