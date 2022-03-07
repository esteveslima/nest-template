// // Responsible for defining data format and relations for graphql

// import {
//   Field,
//   Float,
//   ID,
//   Int,
//   InterfaceType,
//   registerEnumType,
// } from '@nestjs/graphql';
// import { AuthField } from 'src/modules/auth/decorators/graphql/auth-field.decorator';

// import { UserType } from '../../user/graphql/user.type';
// import { enumMediaType, IMedia } from '../interfaces/entity/media.interface';

// registerEnumType(enumMediaType, { name: 'enumMediaType' });

// @InterfaceType()
// export abstract class MediaInterfaceType implements IMedia {
//   // Auto generated fields

//   @Field(() => ID)
//   id: string;

//   @Field(() => Float) // Float to support big numbers
//   createdAt: Date;

//   @Field(() => Float) // Float to support big numbers
//   @AuthField('ADMIN')
//   updatedAt: Date;

//   // Relational fields

//   @Field(() => UserType, { nullable: true })
//   user: UserType;

//   // Editable fields

//   @Field(() => String)
//   title: string;

//   @Field(() => enumMediaType)
//   type: enumMediaType;

//   @Field(() => String)
//   description: string;

//   @Field(() => Int)
//   durationSeconds: number;

//   @Field(() => String)
//   contentBase64: string;

//   @Field(() => Int)
//   views: number;

//   @Field(() => Boolean)
//   available: boolean;
// }
