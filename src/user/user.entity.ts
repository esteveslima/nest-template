// Responsible for defining data format and relations in the database
// Implementing validations for ORM(for database) and Pipes(for DTOs), centralizing all definitions in a single entity class that can be extended

import { Exclude, Transform, Type } from 'class-transformer'; // transformation tools https://github.com/typestack/class-transformer
import {
  IsEmail,
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
  Unique,
  UpdateDateColumn,
} from 'typeorm'; // typeORM tools https://orkhan.gitbook.io/typeorm/docs/embedded-entities

export enum enumGenderType {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

@Entity()
export class UserEntity {
  // Auto generated fields

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  @Exclude({ toPlainOnly: true }) // remove property from JSON serialization
  updatedAt: Date;

  // Editable fields

  @Column({ type: 'varchar', length: 80 })
  @Unique(['username'])
  @IsNotEmpty()
  @IsString()
  @Length(5, 80)
  username: string;

  @Column({ type: 'varchar', length: 180 })
  @Unique(['email'])
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @Length(5, 180)
  email: string;

  @Column({ type: 'enum', enum: enumGenderType })
  @IsNotEmpty()
  @IsEnum(enumGenderType, {
    message: `gender must be a valid enum value: ${Object.values(
      enumGenderType,
    )}`,
  })
  gender: enumGenderType;

  @Column({ type: 'integer' })
  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  age: number;

  @Column({ type: 'varchar', length: 80 })
  @IsNotEmpty()
  @IsString()
  @Length(5, 80)
  password: string;
}
