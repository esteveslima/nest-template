// // Wrapping npm package as custom provider, allowing DI

// import { Provider } from '@nestjs/common';
// import * as uuid from 'uuid';
// import { UUID_PROVIDER } from '../constants';

// export type TypeUuidProvider = typeof uuid;
// const UuidProviderToken = UUID_PROVIDER;

// export const UuidCustomProvider: Provider<typeof uuid> = {
//   provide: UuidProviderToken,
//   useValue: uuid,
// };
