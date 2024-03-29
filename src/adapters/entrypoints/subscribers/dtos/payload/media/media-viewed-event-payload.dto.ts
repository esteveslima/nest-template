// Object encapsulating data required for a single operation
// Extends base DTO, which already contains pipe validations and transformation decorators

import { PartialType, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer'; // transformation tools https://github.com/typestack/class-transformer
import {} from 'class-validator'; // validation tools https://github.com/typestack/class-validator
import { IMediaEventPublisherGatewayPublishMediaViewedParams } from 'src/application/interfaces/ports/media-event-publisher/methods/publish-media-viewed.interface';

export class MediaViewedEventPayloadDTO
  implements IMediaEventPublisherGatewayPublishMediaViewedParams
{
  id: string;
}
