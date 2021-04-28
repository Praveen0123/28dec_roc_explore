import 'graphql-import-node';
import { GraphQLModule } from "@graphql-modules/core";

import * as typeDefs from './schema/schema.graphql';
import { resolvers } from './resolvers/resolvers';
import UserProfileProvider from './providers/providers';

export const UserProfileModule = new GraphQLModule
  (
    {
      name: 'UserProfiles',
      typeDefs,
      resolvers: resolvers as any,
      providers:
        [
          UserProfileProvider
        ]
    }
  );
