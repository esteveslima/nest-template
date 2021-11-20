// Responsible for defining data format and relations in the database

import { Exclude, Transform, Type } from 'class-transformer'; // transformation tools https://github.com/typestack/class-transformer
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  Length,
  Min,
} from 'class-validator'; // validation tools https://github.com/typestack/class-validator
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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
export class Media {
  // Auto generated fields

  @PrimaryGeneratedColumn('uuid')
  @Exclude() // remove property from serialization
  id: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  @Exclude()
  updatedAt: Date;

  // Editable fields

  @Column({ type: 'enum', enum: enumMediaType })
  @IsNotEmpty()
  @IsEnum(enumMediaType, {
    message: `type must be a valid enum value: ${Object.values(enumMediaType)}`,
  })
  type: enumMediaType;

  @Column({ type: 'varchar', length: 80 })
  @IsNotEmpty()
  @IsString()
  @Length(5, 80)
  title: string;

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

  // readonly fields(not directly editable)

  @Column({ type: 'integer' })
  @Transform(({ value }) => Number.parseInt(value))
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  views: number;
}
