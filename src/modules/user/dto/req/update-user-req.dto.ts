// Object encapsulating data required for a single operation
// Also possible to make data transform and validation

import { OmitType } from '@nestjs/mapped-types';
import { UserEntity } from '../../user.entity';

// Create DTO extending Entity, which contains all the typeORM validations and Pipe validations
// May modify or omit certain properties to match the operation

export class UpdateUserReqDTO extends OmitType(UserEntity, [
  'id',
  'createdAt',
  'updatedAt',
  'role',
  // 'password',
]) {}
