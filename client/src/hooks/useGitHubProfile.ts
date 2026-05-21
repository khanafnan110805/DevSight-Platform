import { useQuery } from '@tanstack/react-query';
import { getUser, getAuthenticatedUser } from '@/services/github/rest';
import { QUERY_KEYS, CACHE_TTL } from '@/config/queryKeys';

export const useGitHubProfile = (username: string) =>
  useQuery({
    queryKey: QUERY_KEYS.PROFILE(username),
    queryFn: () => getUser(username),
    staleTime: CACHE_TTL.PROFILE,
    enabled: !!username,
  });

export const useAuthenticatedProfile = () =>
  useQuery({
    queryKey: ['github', 'auth', 'profile'],
    queryFn: getAuthenticatedUser,
    staleTime: CACHE_TTL.PROFILE,
  });
