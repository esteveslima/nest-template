// Object encapsulating data required for a single operation
// Also possible to make data transform and validation

import { PartialType, PickType } from '@nestjs/mapped-types';
import { UserEntity } from '../../user.entity';

// Create DTO extending Entity, which contains all the typeORM validations and Pipe validations
// May modify or omit certain properties to match the operation

// DTO for search filters
export class SearchUserReqDTO extends PartialType(
  PickType(UserEntity, ['username', 'email']),
) {}
