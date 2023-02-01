// import { Test } from '@nestjs/testing';
// import { AuthRestService } from 'src/modules/auth/auth.service';
// import { UserControllerEntrypoint } from 'src/modules/user/user.controller';
// import { UserRestService } from 'src/modules/user/user-rest.service';
// import { runCommonTests } from 'src/tests/unit/common/controller/run-common-tests';
// import { testSwaggerDocApplied } from 'src/tests/unit/common/controller/test-swagger-doc-applied';

// describe('UserControllerEntrypoint', () => {
//   let userController: UserControllerEntrypoint;
//   let userService: UserRestService;

//   beforeAll(async () => {
//     const userServiceMock: Partial<UserRestService> = {
//       deleteUser: jest.fn(),
//       getUser: jest.fn(),
//       modifyUser: jest.fn(),
//       registerUser: jest.fn(),
//       searchUser: jest.fn(),
//       // verifyUserPassword: jest.fn(),
//     };

//     const moduleRef = await Test.createTestingModule({
//       controllers: [UserControllerEntrypoint],
//       providers: [
//         { provide: UserRestService, useValue: userServiceMock },
//         { provide: AuthRestService, useValue: {} }, // required because of guard decorator
//       ],
//     }).compile();

//     userController = moduleRef.get<UserControllerEntrypoint>(UserControllerEntrypoint);
//     userService = moduleRef.get<UserRestService>(UserRestService);
//   });

//   afterEach(async () => {
//     jest.resetAllMocks();
//   });

//   describe('controller methods basic configuration', () => {
//     runCommonTests(UserControllerEntrypoint, (method) => {
//       testSwaggerDocApplied(method);
//     });
//   });
// });
