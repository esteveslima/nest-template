// Encapsulating data required for opertation in queries
// Extends base args which already contains validations
// Similar to DTOs

import { ArgsType, PickType } from '@nestjs/graphql';
import { IMediaGraphqlServiceRegisterMediaParams } from 'src/modules/apps/media/application/interfaces/services/media-graphql/methods/register-media.interface';
import { MediaBaseArgs } from './base/media-base.args';

type IRegisterMediaData = Omit<IMediaGraphqlServiceRegisterMediaParams, 'user'>;

@ArgsType()
export class RegisterMediaArgsDTO
  extends PickType(MediaBaseArgs, [
    'title',
    'type',
    'description',
    'durationSeconds',
    'contentBase64',
  ] as const)
  implements IRegisterMediaData {}
