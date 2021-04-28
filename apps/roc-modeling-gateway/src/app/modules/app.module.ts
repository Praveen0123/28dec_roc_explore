import { GraphQLModule } from "@graphql-modules/core";
import { UserProfileModule } from './user-profile';


export const AppModule = new GraphQLModule
  (
    {
      imports: () =>
        [
          UserProfileModule
        ]
    }
  );
