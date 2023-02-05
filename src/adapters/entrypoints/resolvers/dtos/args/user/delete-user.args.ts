import { ArgsType, PickType } from '@nestjs/graphql';
import { IUserGraphqlServiceDeleteUserParams } from 'src/application/interfaces/services/user/user-graphql/methods/delete-user.interface';
import { UserBaseArgsDTO } from './base/user-base.args';
@ArgsType()
export class DeleteUserArgsDTO
  extends PickType(UserBaseArgsDTO, ['id'] as const)
  implements IUserGraphqlServiceDeleteUserParams {}
