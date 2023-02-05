import { ArgsType, PickType } from '@nestjs/graphql';
import { IUserGraphqlServiceGetUserParams } from 'src/modules/apps/user/application/interfaces/services/user-graphql/methods/get-user.interface';
import { UserBaseArgsDTO } from './base/user-base.args';
@ArgsType()
export class GetUserArgsDTO
  extends PickType(UserBaseArgsDTO, ['id'] as const)
  implements IUserGraphqlServiceGetUserParams {}
