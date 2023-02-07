# media-collection

Practice project with the theme of a media collection, which may have users interacting with posted medias.

The project is built using [Nestjs](https://nestjs.com/) and following a predictable structure regarding concepts of DDD/Clean/Hexagonal Architecture.

---

## Project's Structure

Overall structure regarding the proposed architecture.
(May have hidden files/folders)

```
.
├── .vscode                                           > Configs for vscode environment
├── assets                                            > Extra resources for project
│   ├── docs                                            > Documentation resources
│   └── environment                                     > Tools and resources for setting up development environment
└── src                                               > Source code files
    ├── main.ts                                         > Application start point, contains multiple configurations
    ├── adapters                                        > Grouping files from the project's architecture adapters layer
    │   ├── entrypoints                                   > Responsible for inbound requests
    │   │   ├── consumers                                   > Listen for queue jobs
    │   │   │   ├── dtos                                      > Events payload models
    │   │   │   │   ├── payload                                                                  
    │   │   │   │   │   └── __-job-payload.dto.ts                             
    │   │   │   │   └── result                                           
    │   │   │   │       └── __-job-result.dto.ts                         
    │   │   │   ├── jobs                                      > Jobs definitions
    │   │   │   │   └── constants.ts                                                  
    │   │   │   └── __-consumer.entrypoint.ts                         
    │   │   ├── controllers                                 > Listen for HTTP requests
    │   │   │   ├── dtos                                      > Request/Response models(may have validations)
    │   │   │   │   ├── request                                                  
    │   │   │   │   │   └── __-rest-request.dto.ts                         
    │   │   │   │   └── response                                                  
    │   │   │   │       └── __-rest-response.dto.ts                         
    │   │   │   └── __-controller.entrypoint.ts                         
    │   │   ├── resolvers                                   > Listen for GraphQL requests
    │   │   │   ├── dtos                                      > Operations Arguments and response Types models
    │   │   │   │   ├── args                                                  
    │   │   │   │   │   └── __-graphql-args.dto.ts                         
    │   │   │   │   └── types                                                  
    │   │   │   │       └── __-graphql-type.dto.ts                         
    │   │   │   └── __-resolver.entrypoint.ts                         
    │   │   └── subscribers                                 > Listen for events
    │   │       ├── dtos                                      > Events payload models
    │   │       │   ├── payload                                                  
    │   │       │   │   └── __-event-payload.dto.ts                         
    │   │       │   └── result                                                  
    │   │       │       └── __-event-result.dto.ts                         
    │   │       ├── events                                    > Events definitions
    │   │       │   └── constants.ts                                                  
    │   │       └── __-subscriber.entrypoint.ts                         
    │   ├── exceptions                                    > Exceptions index
    │   └── gateways                                      > Responsible for oubound resources
    │       ├── apis                                        > External services interfaces
    │       │   ├── types                                   > Types definitions for the unkown xternal services
    │       │   └── __-api.gateway.ts                                                  
    │       ├── clients                                     > External libraries
    │       │   └── __-client.gateway.ts                                                  
    │       ├── databases                                   > External data sources
    │       │   ├── models                                    > Database data models
    │       │   └── repositories                              > Database data access
    │       │       └──__-database-repository.gateway.ts                         
    │       ├── producers                                   > Jobs producer
    │       │   ├── jobs                                      > Jobs definitions
    │       |   │   └── constants.ts                                                  
    │       │   └── __-producer.gateway.ts                                                  
    │       └── publisher                                   > Events publisher
    │           ├── events                                    > Events definitions
    │           │   └── constants.ts                                                  
    │           └── __-publisher.gateway.ts                                                  
    ├── application                                     > Grouping files from the project's architecture application layer
    │   ├── exceptions                                    > Application scope exceptions classes
    │   │   ├── ports                                       > Application dependencies exceptions
    │   │   │   └── __.exception.ts                                           
    │   │   └── services                                    > Application services exceptions
    │   │       └── __.exception.ts                                           
    │   ├── interfaces                                    > Interfaces contracts for the application and its dependencies
    │   │   ├── ports                                       > Interfaces Contracts for application dependencies
    │   │   |   └── __.interface.ts                                      
    │   │   ├── services                                    > Interfaces Contracts of the application
    │   │   |   └── __.interface.ts                                      
    │   │   └── types                                       > Interfaces related to the application
    │   │       └── __.interface.ts                                      
    │   └── services                                      > Application services containing business logic
    │       └── __.service.ts                                      
    ├── domain                                          > Grouping files from the project's architecture domain layer
    │   ├── entities                                      > Classes modeled into business domain entities
    │   │   └── __.ts                                                        
    │   ├── exceptions                                    > Domain scope exceptions classes
    │   │   └── __.exception.ts                                           
    │   └── repositories                                  > Interfaces Contracts for domain entities repositories
    │       └── __.exception.ts                                                        
    └── infrastructure                                  > Grouping files from the project's architecture infrastructure layer
        ├── config                                        > Configuration modules/helpers setting up external resources
        │   ├── modules                                     > Nest.js modules encapsulating clients and configurations
        │   │   └── ...                                                        
        │   │   └── app.module.ts                           > Main Nest.js module containing all imports and configurations
        │   └── __.ts                                                        
        ├── internals                                     > Framework/Language specific features
        │   ├── decorators                                  > Typescript/Nest.js annotation functions to wrap extra behaviors on functions         
        │   |   └── _.decorator.ts                                  
        │   ├── enhancers                                   > Nest.js specific interactors         
        │   |   ├── filters                                     
        │   |   |   └── _.filter.ts                                     
        │   |   ├── guards                                     
        │   |   |   └── _.guard.ts                                     
        │   |   ├── interceptors                                     
        │   |   |   └── _.interceptor.ts                                     
        │   |   ├── middlewares                                     
        │   |   |   └── _.middleware.ts                                     
        │   |   ├── pipes                                     
        │   |   |   └── _.pipe.ts                                     
        │   ├── providers                                   > Nest.js DI wrappers for external libraries/providers
        │   |   ├── packages
        |   |   |   └── _.provider.ts
        │   |   └── constants.ts                               
        │   └── utils                                       > Utility configuration helpers                          
        └── ...                                                            
```

Related files(e.g.: tests `.spec.ts` files and folders or types `.interface.ts` files and folders) may follow the collocation principle and be put as close as possible to it's reference file while also respecting the overall organization.

---

<br>

## Development environment

Tools and local resources used to setup the local environment may be encountered at [/assets/environment](/assets/environment) folder.

It is required to provide the environment variables. Use the [template](/assets/environment/.template.env) files to build the `.env` file for this local development environment.

<br>

### Local docker environment

An optional, but recommended, docker-compose environment is set up for usage as development environment.

The original container ports may be remapped from host to run alongside other projects/applications in the host machine for a more complete ecosystem, check the [docker-compose](/assets/environment/docker-compose.yml) file to visualize or modify which ports are being used/mapped.

It maps the project files into a container containing the required dependencies and infrastructure resources for local development(which can be referenced like in service discovery).

The [Makefile](./Makefile) created contains commands for easly setting up environment:

- Build the enviroment and enter it's shell to use it's resources and dependencies:
```
$ make up             > build containers development environment
$ make sh             > enter shell at container environment
```

- Leave the environment and shut down the containers after usage:
```
[/nest-container] $ exit
$ make down           > destroy containers
```

- Other commands:
```
$ make rebuild        > rebuild environment
```

Alternativelly run these docker-compose commands into the [/assets/environment](/assets/environment) folder manually.

PS.: Check the makefile parameters to ensure it's initializing the correct development container and project(this last one to ensure containers from different applications are visible within the same project)

<br>

## Run the project

After setting up the [development environment](#development-environment) you may build and run the project.

- Install project's dependencies:
```
$ npm install
```

- Run the project in watch mode:
```
$ npm run start:dev
```

- To run with vscode debugger enabled:
```
$ npm run start:debug
```
PS.: Attach the debugger(F5) after starting the server in debug mode

---

<br>

## Docs and Tools

- [Run the project](#run-the-project) to access some developer tools:
  - `/swagger` route to view live API documentation.
    - Alternativelly, import the [Postman collection](assets/docs/postman) backup.
  - `/api/graphql` route to test with a playground for GraphQL API.
  - ~~`/bull-board` route to view and manage async jobs with BullMQ queues.~~

PS.: Application developer tools credentials may be defined at the `.env` file.
  
- The docker development environment provides a web admin pages for databases and services:
  -  Postgres: `http://localhost:5433`
  -  ~~MongoDB: `http://localhost:27018`~~
  -  ~~Redis: `http://localhost:6380`~~
  
PS.: docker-compose developer tools credentials may be defined at the [docker-compose](/assets/environment/docker-compose.yml).

---

<br>

## Extra Notes

- Developer experience(DX):
  - Available standardized [local docker environment](#local-docker-environment) and [tools](#docs-and-tools)
  - Swagger live documentation automatically built with nestjs plugin, mirroring entrypoints(controllers)
  - Streamlined contribution automation with git hooks:
    - Staged code linted/formatted/validated/tested
    - Commit build helper with formatter
  - (Clean/Hexagonal/DDD)Architecture dependency rule:
    - Ensured by [eslint-boundaries](.eslintrc-boundaries.js) rules
    - May be ignored at the adapters layer to have a more pragmatic approach
- Application:
  - Auth(jwt):
    - Using decorators to annotate authentication/authorization requirements for resources
    - Users may have roles to grant access to resources:
      - Rest API: private routes
      - GraphQL: private "routes" and individual private entities fields 
  - Logging:
    - using Pino logger to link all logs from a specific request context through an unique id
    - autologging:
      - API requests
      - configured infrastructure methods(set at `app.module.ts`) using a wrapper helper function
  - Validation: input validations done by dtos with embbeded validation rules
  - Exceptions: each one discovered have it's own class and can be handled and mapped individually to an error response for each entrypoint/presenter
  - CORS: for a list of specified domains in the `.env` file