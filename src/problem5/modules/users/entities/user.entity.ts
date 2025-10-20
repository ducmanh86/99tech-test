import { Entity, Column, Index } from 'typeorm';
import { Base } from '../../base.entity';

@Entity('users')
export class User extends Base {
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  @Index({ unique: true })
  email: string;
}
