// Responsible for defining data format and relations in the database

import { UserDatabaseModel } from 'src/modules/apps/user/adapters/gateways/databases/models/user.model';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'; // typeORM tools https://orkhan.gitbook.io/typeorm/docs/embedded-entities
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

  @ManyToOne(() => UserDatabaseModel, (user) => user.medias, {
    eager: false,
    onDelete: 'SET NULL',
  })
  user: UserDatabaseModel;

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
