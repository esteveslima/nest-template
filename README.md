# media-collection

Standard Nest project as template for future consultation.
  - theme similar to a shared media library(Youtube, Spotify, etc...)



- Docker compose environment providing services for local development environment
- Base structures built with [Nest CLI](https://docs.nestjs.com/cli/usages)
  - **`nest new <PROJECT_NAME> --skip-git .`**                               > Create new standard project in current directory(skipping git init in this case)
  - **`nest generate module <MODULE_NAME> --no-spec`**                       > Create new module in current project(without module tests)
  - **`nest generate controller <CONTROLLER_NAME> --no-spec`**               > Create new controller in current module(without module tests)
  - **`nest generate service <SERVICE_NAME> --no-spec`**                     > Create new service in current module(without module tests)

- ConfigModule
- TypeORM
- DTO
- Pipes and validation
- Entity
- Repository
- disabled module tests


TODO: list topics to be commented on this readme
 - .
 - providers and custom providers
   - injectable classes can be marked as providers for modules
   - for custom values(e.g.: npm packages) it should be wrapped as a custom provider to allow DI and also inject manually with it's token value
 - db
   - only access to data is through repository
   - possible to have multiple databases and select by name
 - doc
   - GET /swagger on brouser to access live doc
   - GET /api/graphql on browser to access graphql playground with live schema
 - auth
   - authentication & authorization built on the guard to simplify applying with decorators
 - graphql
   - for graphql can applied auth guard on entire methods(query/mutations) as well as only on fields(which use a custom interceptor to get user info and a field middleware to limit access only on "private" fields, creating a model with mixed permissions)