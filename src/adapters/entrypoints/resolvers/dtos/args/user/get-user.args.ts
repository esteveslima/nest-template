import { ArgsType, PickType } from '@nestjs/graphql';
import { IUserGraphqlServiceGetUserParams } from 'src/application/interfaces/services/user/user-graphql/methods/get-user.interface';
import { UserBaseArgsDTO } from './base/user-base.args';
@ArgsType()
export class GetUserArgsDTO
  extends PickType(UserBaseArgsDTO, ['id'] as const)
  implements IUserGraphqlServiceGetUserParams {}
