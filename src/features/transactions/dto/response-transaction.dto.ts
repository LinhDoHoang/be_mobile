import { Exclude, Expose } from 'class-transformer';
import { User } from 'src/features/users/entities/user.entity';

export class TransactionResponseDto {
  @Exclude()
  user: User;
}
