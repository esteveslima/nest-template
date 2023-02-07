// Encapsulating data required for opertation in queries
// Extends base args which already contains validations
// Similar to DTOs

import { ArgsType, PickType } from '@nestjs/graphql';
import { IMediaGraphqlServiceRegisterMediaParams } from 'src/application/interfaces/services/media/media-graphql/methods/register-media.interface';
import { MediaBaseGraphqlArgsDTO } from './base/media-base-graphql-args.dto';

type IRegisterMediaData = Omit<IMediaGraphqlServiceRegisterMediaParams, 'user'>;

@ArgsType()
export class RegisterMediaGraphqlArgsDTO
  extends PickType(MediaBaseGraphqlArgsDTO, [
    'title',
    'type',
    'description',
    'durationSeconds',
    'contentBase64',
  ] as const)
  implements IRegisterMediaData {}
