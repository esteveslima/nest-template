import { Test } from '@nestjs/testing';
import { AuthService } from 'src/modules/auth/auth.service';
import { UserController } from 'src/modules/user/user.controller';
import { UserService } from 'src/modules/user/user.service';
import { runCommonTests } from 'src/tests/unit/common/controller/run-common-tests';
import { testSwaggerDocApplied } from 'src/tests/unit/common/controller/test-swagger-doc-applied';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeAll(async () => {
    const userServiceMock: Partial<UserService> = {
      deleteUserById: jest.fn(),
      getUserById: jest.fn(),
      modifyUserById: jest.fn(),
      registerUser: jest.fn(),
      searchUser: jest.fn(),
      verifyUserPassword: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: UserService, useValue: userServiceMock },
        { provide: AuthService, useValue: {} }, // required because of guard decorator
      ],
    }).compile();

    userController = moduleRef.get<UserController>(UserController);
    userService = moduleRef.get<UserService>(UserService);
  });

  afterEach(async () => {
    jest.resetAllMocks();
  });

  describe('controller methods basic configuration', () => {
    runCommonTests(UserController, (method) => {
      testSwaggerDocApplied(method);
    });
  });
});
