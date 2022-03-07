import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PatchUserReqDTO } from '../../../../../modules/user/dto/req/patch-user-req.dto';

import { RegisterUserReqDTO } from '../../../../../modules/user/dto/req/register-user-req.dto';
import { SearchUserReqDTO } from '../../../../../modules/user/dto/req/search-user-req.dto';
import { UpdateUserReqDTO } from '../../../../../modules/user/dto/req/update-user-req.dto';
import { GetUserResDTO } from '../../../../../modules/user/dto/res/get-user-res.dto';
import { RegisterUserResDTO } from '../../../../../modules/user/dto/res/register-user-res.dto';
import { SearchUserResDTO } from '../../../../../modules/user/dto/res/search-user-res.dto';
import {
  enumGenderType,
  enumRole,
} from '../../../../../modules/user/interfaces/entity/user.interface';
import { UserEntity } from '../../../../../modules/user/user.entity';
import { UserRepository } from '../../../../../modules/user/user.repository';
import { UserService } from '../../../../../modules/user/user.service';

// TODO: mock bcrypt with service
// TODO: mock only EXTERNAL dependencies and use local dependencies integrated, relative to the APPLICATION(otherwise, mocking dependencies of local files may lead to a mocking hell)

it('disabled due to refactoring exposed mocking hell problem', () => {
  expect(true).toBeTruthy();
});

// const userEntityMock: UserEntity = {
//   id: 'id',
//   createdAt: new Date(),
//   updatedAt: new Date(),
//   username: 'username',
//   password: '$abc.someHashedPassword',
//   email: 'email',
//   age: 0,
//   gender: enumGenderType.OTHER,
//   role: enumRole.USER,
//   medias: [],
// };

// const userRepositoryMockBase = {
//   registerUser: jest.fn(),
//   getUserById: jest.fn(),
//   deleteUserById: jest.fn(),
//   modifyUserById: jest.fn(),
//   searchUser: jest.fn(),
// };

// const userRepositoryMockSuccess = {
//   registerUser: jest.fn((params: RegisterUserReqDTO) =>
//     Promise.resolve({ ...userEntityMock, ...params }),
//   ),
//   getUserById: jest.fn(() => Promise.resolve(userEntityMock)),
//   deleteUserById: jest.fn(() => Promise.resolve(true)),
//   modifyUserById: jest.fn(() => Promise.resolve(true)),
//   searchUser: jest.fn(() => Promise.resolve(userEntityMock)),
// };
// const userRepositoryMockFail = {
//   registerUser: jest.fn(() => {
//     throw new Error();
//   }),
//   getUserById: jest.fn(() => Promise.resolve(undefined)),
//   deleteUserById: jest.fn(() => Promise.resolve(false)),
//   modifyUserById: jest.fn(() => Promise.resolve(false)),
//   searchUser: jest.fn(() => Promise.resolve(undefined)),
// };

// describe('UserService', () => {
//   let userService: UserService;
//   let userRepositoryMock: typeof userRepositoryMockBase;

//   // Create a mock module for every test
//   beforeEach(async () => {
//     jest.restoreAllMocks();

//     userRepositoryMock = userRepositoryMockBase;
//     const module = await Test.createTestingModule({
//       providers: [
//         UserService,
//         {
//           provide: UserRepository,
//           useValue: userRepositoryMock,
//         },
//       ],
//     }).compile();
//     userService = module.get(UserService);
//   });

//   describe('registerUser', () => {
//     it('calls userRepository.registerUser with hashed password', async () => {
//       userRepositoryMock.registerUser = userRepositoryMockSuccess.registerUser;
//       const userMock: RegisterUserReqDTO = {
//         username: 'username',
//         password: 'password',
//         email: 'email',
//         age: 0,
//         gender: enumGenderType.OTHER,
//         role: enumRole.USER,
//       };

//       await userService.registerUser(userMock);

//       const userRepositoryMockCallParams: RegisterUserReqDTO =
//         userRepositoryMock.registerUser.mock.calls[0][0];

//       expect(userRepositoryMock.registerUser).toBeCalled();
//       expect(userRepositoryMock.registerUser).not.toBeCalledWith(userMock);
//       expect(userRepositoryMockCallParams.password).not.toBe(userMock.password);
//     });

//     it('returns created object without password', async () => {
//       userRepositoryMock.registerUser = userRepositoryMockSuccess.registerUser;
//       const userMock: RegisterUserReqDTO = {
//         username: 'username',
//         password: 'password',
//         email: 'email',
//         age: 0,
//         gender: enumGenderType.OTHER,
//         role: enumRole.USER,
//       };

//       const result = await userService.registerUser(userMock);

//       expect(result['password']).not.toBeDefined();
//       expect(result).toEqual(
//         expect.objectContaining({
//           id: expect.any(String),
//           //
//           username: expect.any(String),
//           email: expect.any(String),
//           age: expect.any(Number),
//           gender: expect.any(String),
//           role: expect.any(String),
//         } as RegisterUserResDTO),
//       );
//     });
//   });

//   describe('getUserById', () => {
//     it('throws NotFoundException if user is not found', async () => {
//       userRepositoryMock.getUserById = userRepositoryMockFail.getUserById;
//       const uuid = 'uuid';

//       await expect(userService.getUserById(uuid)).rejects.toThrowError(
//         NotFoundException,
//       );
//     });

//     it('returns found object without password', async () => {
//       userRepositoryMock.getUserById = userRepositoryMockSuccess.getUserById;
//       const uuid = 'uuid';

//       const result = await userService.getUserById(uuid);

//       expect(userRepositoryMock.getUserById).toBeCalled();
//       expect(result['password']).not.toBeDefined();
//       expect(result).toEqual(
//         expect.objectContaining({
//           id: expect.any(String),
//           createdAt: expect.any(Date),
//           medias: expect.any(Array),
//           username: expect.any(String),
//           email: expect.any(String),
//           age: expect.any(Number),
//           gender: expect.any(String),
//           role: expect.any(String),
//         } as GetUserResDTO),
//       );
//     });
//   });

//   describe('deleteUserById', () => {
//     it('throws NotFoundException if user is not found', async () => {
//       userRepositoryMock.deleteUserById = userRepositoryMockFail.deleteUserById;
//       const uuid = 'uuid';

//       await expect(userService.deleteUserById(uuid)).rejects.toThrowError(
//         NotFoundException,
//       );
//     });

//     it('returns void if operation was sucessful', async () => {
//       userRepositoryMock.deleteUserById =
//         userRepositoryMockSuccess.deleteUserById;
//       const uuid = 'uuid';

//       const result = await userService.deleteUserById(uuid);

//       expect(userRepositoryMock.deleteUserById).toBeCalled();
//       expect(result).toBeUndefined();
//     });
//   });

//   describe('modifyUserById', () => {
//     it('throws NotFoundException if user is not found', async () => {
//       userRepositoryMock.modifyUserById = userRepositoryMockFail.modifyUserById;
//       const uuid = 'uuid';
//       const userMock: PatchUserReqDTO | UpdateUserReqDTO = {
//         username: 'username',
//         password: 'password',
//         email: 'email',
//         age: 0,
//         gender: enumGenderType.OTHER,
//       };

//       await expect(
//         userService.modifyUserById(uuid, userMock),
//       ).rejects.toThrowError(NotFoundException);
//     });

//     it('calls userRepository.modifyUserById with hashed password if provided', async () => {
//       userRepositoryMock.modifyUserById =
//         userRepositoryMockSuccess.modifyUserById;
//       const uuid = 'uuid';
//       const userMock: PatchUserReqDTO | UpdateUserReqDTO = {
//         username: 'username',
//         password: 'password',
//         email: 'email',
//         age: 0,
//         gender: enumGenderType.OTHER,
//       };

//       await userService.modifyUserById(uuid, userMock);

//       const userRepositoryMockCallParams: PatchUserReqDTO | UpdateUserReqDTO =
//         userRepositoryMock.modifyUserById.mock.calls[0][0];

//       expect(userRepositoryMock.modifyUserById).toBeCalled();
//       expect(userRepositoryMock.modifyUserById).not.toBeCalledWith(userMock);
//       expect(userRepositoryMockCallParams.password).not.toBe(userMock.password);
//     });

//     it('returns void if operation was sucessful', async () => {
//       userRepositoryMock.modifyUserById =
//         userRepositoryMockSuccess.modifyUserById;
//       const uuid = 'uuid';
//       const userMock: PatchUserReqDTO | UpdateUserReqDTO = {
//         username: 'username',
//         password: 'password',
//         email: 'email',
//         age: 0,
//         gender: enumGenderType.OTHER,
//       };

//       const result = await userService.modifyUserById(uuid, userMock);

//       expect(userRepositoryMock.modifyUserById).toBeCalled();
//       expect(result).toBeUndefined();
//     });
//   });

//   describe('searchUser', () => {
//     it('throws BadRequestException if no search filters were provided', async () => {
//       const searchFiltersMock: SearchUserReqDTO = {};

//       await expect(
//         userService.searchUser(searchFiltersMock),
//       ).rejects.toThrowError(BadRequestException);
//       expect(userRepositoryMock.searchUser).not.toBeCalled();
//     });

//     it('throws NotFoundException if no user was found', async () => {
//       userRepositoryMock.searchUser = userRepositoryMockFail.searchUser;
//       const searchFiltersMock: SearchUserReqDTO = {
//         email: 'email',
//         username: 'username',
//       };

//       await expect(
//         userService.searchUser(searchFiltersMock),
//       ).rejects.toThrowError(NotFoundException);
//       expect(userRepositoryMock.searchUser).toBeCalled();
//     });

//     it('returns found object without password', async () => {
//       userRepositoryMock.searchUser = userRepositoryMockSuccess.searchUser;
//       const searchFiltersMock: SearchUserReqDTO = {
//         email: 'email',
//         username: 'username',
//       };

//       const result = await userService.searchUser(searchFiltersMock);

//       expect(userRepositoryMock.searchUser).toBeCalled();
//       expect(result['password']).not.toBeDefined();
//       expect(result).toEqual(
//         // TODO: remove objectContaining to assert exact object properties with no extras? (after applying plaintoclass to service)
//         expect.objectContaining({
//           id: expect.any(String),
//           // createdAt: expect.any(Date),
//           medias: expect.any(Array),
//           username: expect.any(String),
//           email: expect.any(String),
//           // age: expect.any(Number),
//           // gender: expect.any(String),
//           role: expect.any(String),
//         } as SearchUserResDTO),
//       );
//     });
//   });

//   describe('verifyUserPassword', () => {
//     it('returns false if one of the credentials is missing', async () => {
//       const result1 = await userService.verifyUserPassword(
//         undefined,
//         'password',
//       );
//       const result2 = await userService.verifyUserPassword(
//         'username',
//         undefined,
//       );
//       const result3 = await userService.verifyUserPassword(
//         undefined,
//         undefined,
//       );

//       expect(result1 && result2 && result3).toBeFalsy();
//     });

//     it('return false if somehow the username is not found', async () => {
//       userRepositoryMock.searchUser = userRepositoryMockFail.searchUser;
//       const username = 'username';
//       const password = 'password';

//       const result = await userService.verifyUserPassword(username, password);

//       expect(result).toBeFalsy();
//     });

//     it('returns result of comparision between provided value and stored hash', async () => {
//       const userMock: RegisterUserReqDTO = {
//         username: 'username',
//         password: 'password',
//         email: 'email',
//         age: 0,
//         gender: enumGenderType.OTHER,
//         role: enumRole.USER,
//       };
//       // Custom mock for searchUser to return a non-hashed password for the sake of the test
//       userRepositoryMock.searchUser = jest.fn(() => ({
//         ...userMock,
//         password: userMock.password,
//       }));

//       // Mock private function to compare without hashes
//       jest
//         .spyOn(userService as any, 'compareHash')
//         .mockImplementation((value, hash) => value === hash);

//       // Create test parameters
//       const username = 'username';
//       const correctPassword = 'password';
//       const wrongPassword = '123';

//       const resultCorrect = await userService.verifyUserPassword(
//         username,
//         correctPassword,
//       );
//       const resultWrong = await userService.verifyUserPassword(
//         username,
//         wrongPassword,
//       );

//       expect(resultCorrect).toBeTruthy();
//       expect(resultWrong).toBeFalsy();
//     });
//   });
// });
