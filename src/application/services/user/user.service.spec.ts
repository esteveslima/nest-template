// import { BadRequestException, NotFoundException } from '@nestjs/common';
// import { Test } from '@nestjs/testing';
// import { PatchUserReqDTO } from '../../../../../modules/user/dto/rest/req/patch-user-req.dto';

// import { RegisterUserReqDTO } from '../../../../../modules/user/dto/rest/req/register-user-req.dto';
// import { SearchUserReqDTO } from '../../../../../modules/user/dto/rest/req/search-user-req.dto';
// import { UpdateUserReqDTO } from '../../../../../modules/user/dto/rest/req/update-user-req.dto';
// import { GetUserResDTO } from '../../../../../modules/user/dto/res/get-user-res.dto';
// import { RegisterUserResDTO } from '../../../../../modules/user/dto/res/register-user-res.dto';
// import { SearchUserResDTO } from '../../../../../modules/user/dto/res/search-user-res.dto';
// import {
//   enumGenderType,
//   enumRole,
// } from '../../../../../modules/user/interfaces/entity/user.interface';
// import { UserEntity } from '../../../../../modules/user/models/user.entity';
// import { IUserGateway } from '../../../../../modules/user/user.repository';
// import { UserRestService } from '../../../../../modules/user/services/user-rest.service';

// TODO: mock bcrypt with service
// TODO: mock only EXTERNAL dependencies and use local dependencies integrated, relative to the APPLICATION(otherwise, mocking dependencies of local files may lead to a mocking hell)

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

// const userGatewayMockBase = {
//   registerUser: jest.fn(),
//   getUser: jest.fn(),
//   deleteUser: jest.fn(),
//   modifyUser: jest.fn(),
//   searchUser: jest.fn(),
// };

// const userGatewayMockSuccess = {
//   registerUser: jest.fn((params: RegisterUserReqDTO) =>
//     Promise.resolve({ ...userEntityMock, ...params }),
//   ),
//   getUser: jest.fn(() => Promise.resolve(userEntityMock)),
//   deleteUser: jest.fn(() => Promise.resolve(true)),
//   modifyUser: jest.fn(() => Promise.resolve(true)),
//   searchUser: jest.fn(() => Promise.resolve(userEntityMock)),
// };
// const userGatewayMockFail = {
//   registerUser: jest.fn(() => {
//     throw new Error();
//   }),
//   getUser: jest.fn(() => Promise.resolve(undefined)),
//   deleteUser: jest.fn(() => Promise.resolve(false)),
//   modifyUser: jest.fn(() => Promise.resolve(false)),
//   searchUser: jest.fn(() => Promise.resolve(undefined)),
// };

// describe('UserRestService', () => {
//   let userService: UserRestService;
//   let userGatewayMock: typeof userGatewayMockBase;

//   // Create a mock module for every test
//   beforeEach(async () => {
//     jest.restoreAllMocks();

//     userGatewayMock = userGatewayMockBase;
//     const module = await Test.createTestingModule({
//       providers: [
//         UserRestService,
//         {
//           provide: IUserGateway,
//           useValue: userGatewayMock,
//         },
//       ],
//     }).compile();
//     userService = module.get(UserRestService);
//   });

//   describe('registerUser', () => {
//     it('calls userGateway.registerUser with hashed password', async () => {
//       userGatewayMock.registerUser = userGatewayMockSuccess.registerUser;
//       const userMock: RegisterUserReqDTO = {
//         username: 'username',
//         password: 'password',
//         email: 'email',
//         age: 0,
//         gender: enumGenderType.OTHER,
//         role: enumRole.USER,
//       };

//       await userService.registerUser(userMock);

//       const userGatewayMockCallParams: RegisterUserReqDTO =
//         userGatewayMock.registerUser.mock.calls[0][0];

//       expect(userGatewayMock.registerUser).toBeCalled();
//       expect(userGatewayMock.registerUser).not.toBeCalledWith(userMock);
//       expect(userGatewayMockCallParams.password).not.toBe(userMock.password);
//     });

//     it('returns created object without password', async () => {
//       userGatewayMock.registerUser = userGatewayMockSuccess.registerUser;
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

//   describe('getUser', () => {
//     it('throws NotFoundException if user is not found', async () => {
//       userGatewayMock.getUser = userGatewayMockFail.getUser;
//       const uuid = 'uuid';

//       await expect(userService.getUser(uuid)).rejects.toThrowError(
//         NotFoundException,
//       );
//     });

//     it('returns found object without password', async () => {
//       userGatewayMock.getUser = userGatewayMockSuccess.getUser;
//       const uuid = 'uuid';

//       const result = await userService.getUser(uuid);

//       expect(userGatewayMock.getUser).toBeCalled();
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

//   describe('deleteUser', () => {
//     it('throws NotFoundException if user is not found', async () => {
//       userGatewayMock.deleteUser = userGatewayMockFail.deleteUser;
//       const uuid = 'uuid';

//       await expect(userService.deleteUser(uuid)).rejects.toThrowError(
//         NotFoundException,
//       );
//     });

//     it('returns void if operation was sucessful', async () => {
//       userGatewayMock.deleteUser =
//         userGatewayMockSuccess.deleteUser;
//       const uuid = 'uuid';

//       const result = await userService.deleteUser(uuid);

//       expect(userGatewayMock.deleteUser).toBeCalled();
//       expect(result).toBeUndefined();
//     });
//   });

//   describe('modifyUser', () => {
//     it('throws NotFoundException if user is not found', async () => {
//       userGatewayMock.modifyUser = userGatewayMockFail.modifyUser;
//       const uuid = 'uuid';
//       const userMock: PatchUserReqDTO | UpdateUserReqDTO = {
//         username: 'username',
//         password: 'password',
//         email: 'email',
//         age: 0,
//         gender: enumGenderType.OTHER,
//       };

//       await expect(
//         userService.modifyUser(uuid, userMock),
//       ).rejects.toThrowError(NotFoundException);
//     });

//     it('calls userGateway.modifyUser with hashed password if provided', async () => {
//       userGatewayMock.modifyUser =
//         userGatewayMockSuccess.modifyUser;
//       const uuid = 'uuid';
//       const userMock: PatchUserReqDTO | UpdateUserReqDTO = {
//         username: 'username',
//         password: 'password',
//         email: 'email',
//         age: 0,
//         gender: enumGenderType.OTHER,
//       };

//       await userService.modifyUser(uuid, userMock);

//       const userGatewayMockCallParams: PatchUserReqDTO | UpdateUserReqDTO =
//         userGatewayMock.modifyUser.mock.calls[0][0];

//       expect(userGatewayMock.modifyUser).toBeCalled();
//       expect(userGatewayMock.modifyUser).not.toBeCalledWith(userMock);
//       expect(userGatewayMockCallParams.password).not.toBe(userMock.password);
//     });

//     it('returns void if operation was sucessful', async () => {
//       userGatewayMock.modifyUser =
//         userGatewayMockSuccess.modifyUser;
//       const uuid = 'uuid';
//       const userMock: PatchUserReqDTO | UpdateUserReqDTO = {
//         username: 'username',
//         password: 'password',
//         email: 'email',
//         age: 0,
//         gender: enumGenderType.OTHER,
//       };

//       const result = await userService.modifyUser(uuid, userMock);

//       expect(userGatewayMock.modifyUser).toBeCalled();
//       expect(result).toBeUndefined();
//     });
//   });

//   describe('searchUser', () => {
//     it('throws BadRequestException if no search filters were provided', async () => {
//       const searchFiltersMock: SearchUserReqDTO = {};

//       await expect(
//         userService.searchUser(searchFiltersMock),
//       ).rejects.toThrowError(BadRequestException);
//       expect(userGatewayMock.searchUser).not.toBeCalled();
//     });

//     it('throws NotFoundException if no user was found', async () => {
//       userGatewayMock.searchUser = userGatewayMockFail.searchUser;
//       const searchFiltersMock: SearchUserReqDTO = {
//         email: 'email',
//         username: 'username',
//       };

//       await expect(
//         userService.searchUser(searchFiltersMock),
//       ).rejects.toThrowError(NotFoundException);
//       expect(userGatewayMock.searchUser).toBeCalled();
//     });

//     it('returns found object without password', async () => {
//       userGatewayMock.searchUser = userGatewayMockSuccess.searchUser;
//       const searchFiltersMock: SearchUserReqDTO = {
//         email: 'email',
//         username: 'username',
//       };

//       const result = await userService.searchUser(searchFiltersMock);

//       expect(userGatewayMock.searchUser).toBeCalled();
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
//       userGatewayMock.searchUser = userGatewayMockFail.searchUser;
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
//       userGatewayMock.searchUser = jest.fn(() => ({
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
