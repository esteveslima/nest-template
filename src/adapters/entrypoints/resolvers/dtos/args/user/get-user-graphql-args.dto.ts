import { ArgsType, PickType } from '@nestjs/graphql';
import { IUserGraphqlServiceGetUserParams } from 'src/application/interfaces/services/user/user-graphql/methods/get-user.interface';
import { UserBaseGraphqlArgsDTO } from './base/user-base-graphql-args.dto';
@ArgsType()
export class GetUserGraphqlArgsDTO
  extends PickType(UserBaseGraphqlArgsDTO, ['id'] as const)
  implements IUserGraphqlServiceGetUserParams {}
