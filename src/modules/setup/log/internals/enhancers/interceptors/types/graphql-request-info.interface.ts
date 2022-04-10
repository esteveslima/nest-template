// import { GraphQLObjectType, GraphQLSchema } from 'graphql';

export interface IGraphQLRequestInfo {
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
