// import { GraphQLObjectType, GraphQLSchema } from 'graphql';

export interface IGraphQLInfo {
  path: {
    typename: string;
    key: string;
  };
  fieldNodes: {
    arguments: {
      name: { value: string };
      value: { value: any };
    }[];
  }[];
  // returnType: GraphQLObjectType;
  // schema: GraphQLSchema;
}
