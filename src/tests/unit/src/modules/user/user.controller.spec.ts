// import { Test } from '@nestjs/testing';
// import { AuthRestService } from 'src/modules/auth/auth.service';
// import { UserController } from 'src/modules/user/user.controller';
// import { UserRestService } from 'src/modules/user/user-rest.service';
// import { runCommonTests } from 'src/tests/unit/common/controller/run-common-tests';
// import { testSwaggerDocApplied } from 'src/tests/unit/common/controller/test-swagger-doc-applied';

// describe('UserController', () => {
//   let userController: UserController;
//   let userService: UserRestService;

//   beforeAll(async () => {
//     const userServiceMock: Partial<UserRestService> = {
//       deleteUserById: jest.fn(),
//       getUserById: jest.fn(),
//       modifyUserById: jest.fn(),
//       registerUser: jest.fn(),
//       searchUser: jest.fn(),
//       // verifyUserPassword: jest.fn(),
//     };

//     const moduleRef = await Test.createTestingModule({
//       controllers: [UserController],
//       providers: [
//         { provide: UserRestService, useValue: userServiceMock },
//         { provide: AuthRestService, useValue: {} }, // required because of guard decorator
//       ],
//     }).compile();

//     userController = moduleRef.get<UserController>(UserController);
//     userService = moduleRef.get<UserRestService>(UserRestService);
//   });

//   afterEach(async () => {
//     jest.resetAllMocks();
//   });

//   describe('controller methods basic configuration', () => {
//     runCommonTests(UserController, (method) => {
//       testSwaggerDocApplied(method);
//     });
//   });
// });
