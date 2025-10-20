import { ObjectId } from 'mongodb';
import { BaseEntity, CreateDateColumn, DeleteDateColumn, ObjectIdColumn, UpdateDateColumn } from 'typeorm';

export class Base extends BaseEntity {
  @ObjectIdColumn()
  _id?: ObjectId;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  lastModifiedAt?: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date | null;
}
