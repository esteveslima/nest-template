// Responsible for defining data format and relations in the database

import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'; // typeORM tools https://orkhan.gitbook.io/typeorm/docs/embedded-entities
import { UserEntity } from '../../../../../user/adapters/gateways/databases/entities/user.entity';
import { enumMediaType, Media } from '../../../../domain/media.interface';

@Entity()
export class MediaEntity implements Media {
  // Auto generated fields

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  // Relational fields

  @ManyToOne(() => UserEntity, (user) => user.medias, {
    eager: false,
    onDelete: 'SET NULL',
  })
  user: UserEntity;

  // Editable fields

  @Column({ type: 'varchar', length: 80 })
  title: string;

  @Column({ type: 'enum', enum: enumMediaType })
  type: enumMediaType;

  @Column({ type: 'varchar', length: 260 })
  description: string;

  @Column({ type: 'integer' })
  durationSeconds: number;

  @Column({ type: 'varchar' })
  contentBase64: string;

  @Column({ type: 'integer', default: 0 })
  views: number;

  @Column({ type: 'boolean', default: true })
  available: boolean;
}
