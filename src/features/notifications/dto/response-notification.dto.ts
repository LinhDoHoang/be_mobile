import { Exclude } from 'class-transformer';
import { User } from 'src/features/users/entities/user.entity';

export class NotificationResponseDto {
  @Exclude()
  user: User;
}
