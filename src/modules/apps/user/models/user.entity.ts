// Responsible for defining data format and relations in the database

import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm'; // typeORM tools https://orkhan.gitbook.io/typeorm/docs/embedded-entities
import { MediaEntity } from '../../media/models/media.entity';
import {
  enumGenderType,
  enumRole,
  IUser,
} from '../interfaces/models/entities/user-entity.interface';

@Entity()
export class UserEntity implements IUser {
  // Auto generated fields

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  // Relational fields

  @OneToMany(() => MediaEntity, (media) => media.user, { eager: false })
  medias: MediaEntity[];

  // Editable fields

  @Column({ type: 'varchar', length: 80 })
  @Unique(['username'])
  username: string;

  @Column({ type: 'varchar', length: 80 })
  password: string;

  @Column({ type: 'varchar', length: 180 })
  @Unique(['email'])
  email: string;

  @Column({ type: 'enum', enum: enumRole, default: 'USER' })
  role: enumRole;

  @Column({ type: 'enum', enum: enumGenderType })
  gender: enumGenderType;

  @Column({ type: 'integer' })
  age: number;
}
