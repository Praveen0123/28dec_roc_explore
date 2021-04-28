import { QueryResolvers, UserProfile, UserProfileResolvers } from '@roc-modeling-gateway-models';

interface Resolvers
{
  Query: QueryResolvers;
  UserProfile: UserProfileResolvers;
}

export const resolvers: Resolvers =
{
  Query:
  {
    userById: async (_root, args, _ctx): Promise<UserProfile> =>
    {
      return {
        id: args.id,
        firstName: 'bugs',
        lastName: 'bunny',
        fullName: 'weird',
        email: 'me@bugs.com'
      };
    }
  },
  UserProfile:
  {
    __resolveReference: (externalUserProfile: { id: any; }) =>
      ({
        id: externalUserProfile.id,
        firstName: 'bugs',
        lastName: 'bunny',
        fullName: 'weird',
        email: 'me@bugs.com'
      }),
    fullName(userProfileModel: UserProfile): string
    {
      return `${userProfileModel.firstName} ${userProfileModel.lastName}`;
    }
  }
};
