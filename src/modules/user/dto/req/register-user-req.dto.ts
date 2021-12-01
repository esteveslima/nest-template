// Object encapsulating data required for a single operation
// Also possible to make data transform and validation

import { OmitType } from '@nestjs/mapped-types';
import { UserEntity } from '../../user.entity';

// Create DTO extending Entity, which contains all the typeORM validations and Pipe validations
// May modify or omit certain properties to match the operation

export class RegisterUserReqDTO extends OmitType(UserEntity, [
  //TODO: switch all Omit to Pick to more intuitive code?
  'id',
  'createdAt',
  'updatedAt',
]) {}
