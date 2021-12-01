// Responsible for defining data format and relations in the database
// Implementing validations for ORM(for database) and Pipes(for DTOs), centralizing all definitions in a single entity class that can be extended

import { Exclude, Expose, Transform, Type } from 'class-transformer'; // transformation tools https://github.com/typestack/class-transformer
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
  @Expose()
  id: string;

  @CreateDateColumn({ type: 'timestamp' })
  @Expose()
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  @Expose()
  updatedAt: Date;

  // Relational fields

  @ManyToOne(() => UserEntity, (user) => user.medias, { eager: true })
  @Expose()
  user: UserEntity;

  // Editable fields

  @Column({ type: 'varchar', length: 80 })
  @Expose()
  @IsNotEmpty()
  @IsString()
  @Length(5, 80)
  title: string;

  @Column({ type: 'enum', enum: enumMediaType })
  @Expose()
  @IsNotEmpty()
  @IsEnum(enumMediaType, {
    message: `type must be a valid enum value: ${Object.values(enumMediaType)}`,
  })
  type: enumMediaType;

  @Column({ type: 'varchar', length: 260 })
  @Expose()
  @IsString()
  @Length(0, 260)
  description: string;

  @Column({ type: 'integer' })
  @Expose()
  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  durationSeconds: number;

  @Column({ type: 'varchar' })
  @Expose()
  @IsNotEmpty()
  @IsString()
  contentBase64: string;

  @Column({ type: 'integer', default: 0 })
  @Expose()
  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  views: number;

  @Column({ type: 'boolean', default: true })
  @Expose()
  @Type(() => Boolean)
  @IsNotEmpty()
  @IsBoolean()
  available: boolean;
}

// PS.: Setting all decorators in a single file so that they can be extended and reused
//      From top to bottom:
//      First group of decorators are for ORM definitions
//      Second group of decorators are for class transformations
//      Last group of decorators are for pipe validations
