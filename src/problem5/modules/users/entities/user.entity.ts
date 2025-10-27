import { Entity, Column, Index } from 'typeorm';
import { Base } from '../../base.entity';

@Entity('users')
export class UserEntity extends Base {
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  @Index({ unique: true })
  email: string;
}
