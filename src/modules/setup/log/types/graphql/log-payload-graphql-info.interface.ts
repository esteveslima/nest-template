// import { GraphQLObjectType, GraphQLSchema } from 'graphql';

export interface ILogPayloadGraphQLInfo {
  path: {
    typename: string;
    key: string;
  };
  fieldNodes: {
    arguments: {
      name: { value: string };
      value: { value: unknown };
    }[];
  }[];
  // returnType: GraphQLObjectType;
  // schema: GraphQLSchema;
}
