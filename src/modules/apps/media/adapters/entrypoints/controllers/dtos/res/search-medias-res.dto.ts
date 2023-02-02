// Object encapsulating data required for an operation response
// May be often used as a simple interface to allow swagger build documentation

import { PickType } from '@nestjs/swagger'; // mapped-types
import {} from 'class-transformer'; // transformation tools https://github.com/typestack/class-transformer
import { IMediaRestServiceSearchMediasResult } from 'src/modules/apps/media/application/interfaces/services/media-rest/methods/search-medias.interface';
import { Media } from 'src/modules/apps/media/domain/entities/media';

type ISearchMediasItem = IMediaRestServiceSearchMediasResult[0];

export class SearchMediasResDTO
  extends PickType(Media, [
    'id',
    'createdAt',
    'title',
    'type',
    'description',
    'durationSeconds',
    'views',
    'available',
  ] as const)
  implements ISearchMediasItem
{
  username: string;
}
