import { ArgsType, PickType } from '@nestjs/graphql';
import { IUserGraphqlServiceDeleteUserParams } from 'src/application/interfaces/services/user/user-graphql/methods/delete-user.interface';
import { UserBaseGraphqlArgsDTO } from './base/user-base-graphql-args.dto';
@ArgsType()
export class DeleteUserGraphqlArgsDTO
  extends PickType(UserBaseGraphqlArgsDTO, ['id'] as const)
  implements IUserGraphqlServiceDeleteUserParams {}
