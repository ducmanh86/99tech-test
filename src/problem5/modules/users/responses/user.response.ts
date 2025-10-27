import { UserEntity } from '../entities/user.entity';

export class UserResponse {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  createdAt?: Date;
  lastModifiedAt?: Date;
  deletedAt?: Date;

  constructor(user: UserEntity) {
    this.id = user._id?.toString() ?? '';
    this.email = user.email;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.createdAt = user.createdAt;
    this.lastModifiedAt = user.lastModifiedAt;
    this.deletedAt = user.deletedAt;
    // Transform and map only what should be exposed
  }

  static fromUserList(users: UserEntity[]): UserResponse[] {
    return users.map((user) => new UserResponse(user));
  }
}
