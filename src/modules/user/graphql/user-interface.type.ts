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
// import { MediaType } from '../../media/graphql/media.type';
// import {
//   enumGenderType,
//   enumRole,
//   IUser,
// } from '../interfaces/entity/user.interface';

// registerEnumType(enumRole, { name: 'enumRole' });
// registerEnumType(enumGenderType, { name: 'enumGenderType' });

// @InterfaceType()
// export abstract class UserInterfaceType implements IUser {
//   // Auto generated fields

//   @Field(() => ID)
//   @AuthField('ADMIN')
//   id: string;

//   @Field(() => Float) // Float to support big numbers
//   @AuthField('ADMIN', 'USER')
//   createdAt: Date;

//   @Field(() => Float) // Float to support big numbers
//   @AuthField('ADMIN')
//   updatedAt: Date;

//   // Relational fields

//   @Field(() => [MediaType], { nullable: 'itemsAndList' })
//   medias: MediaType[];

//   // Editable fields

//   @Field(() => String)
//   username: string;

//   password: string; // cannot be a field

//   @Field(() => String)
//   @AuthField('ADMIN')
//   email: string;

//   @Field(() => enumRole)
//   @AuthField('ADMIN')
//   role: enumRole;

//   @Field(() => enumGenderType)
//   @AuthField('ADMIN', 'USER')
//   gender: enumGenderType;

//   @Field(() => Int)
//   @AuthField('ADMIN')
//   age: number;
// }
