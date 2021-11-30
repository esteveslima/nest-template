// Responsible for defining data format and relations in the database
// Implementing validations for ORM(for database) and Pipes(for DTOs), centralizing all definitions in a single entity class that can be extended

import { Exclude, Transform, Type } from 'class-transformer'; // transformation tools https://github.com/typestack/class-transformer
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  Length,
  Min,
} from 'class-validator'; // validation tools https://github.com/typestack/class-validator
import { UserEntity } from '../user/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'; // typeORM tools https://orkhan.gitbook.io/typeorm/docs/embedded-entities

export enum enumMediaType {
  MUSIC = 'MUSIC',
  VIDEO = 'VIDEO',
  MOVIE = 'MOVIE',
  DOCUMENTARY = 'DOCUMENTARY',
  SHOW = 'SHOW',
  PODCAST = 'PODCAST',
  AUDIOBOOK = 'AUDIOBOOK',
}

@Entity()
export class MediaEntity {
  // Auto generated fields

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  @Exclude({ toPlainOnly: true }) // remove property from JSON serialization
  updatedAt: Date;

  // Relational fields

  @ManyToOne(() => UserEntity, (user) => user.medias, { eager: true })
  user: UserEntity;

  // Editable fields

  @Column({ type: 'varchar', length: 80 })
  @IsNotEmpty()
  @IsString()
  @Length(5, 80)
  title: string;

  @Column({ type: 'enum', enum: enumMediaType })
  @IsNotEmpty()
  @IsEnum(enumMediaType, {
    message: `type must be a valid enum value: ${Object.values(enumMediaType)}`,
  })
  type: enumMediaType;

  @Column({ type: 'varchar', length: 260 })
  @IsString()
  @Length(0, 260)
  description: string;

  @Column({ type: 'integer' })
  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  durationSeconds: number;

  @Column({ type: 'varchar' })
  @IsNotEmpty()
  @IsString()
  contentBase64: string;

  @Column({ type: 'integer', default: 0 })
  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  views: number;

  @Column({ type: 'boolean', default: true })
  @Type(() => Boolean)
  @IsNotEmpty()
  @IsBoolean()
  available: boolean;
}
