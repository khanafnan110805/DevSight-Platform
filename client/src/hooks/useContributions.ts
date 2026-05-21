import { useQuery } from '@tanstack/react-query';
import { getContributions } from '@/services/github/graphql';
import { QUERY_KEYS, CACHE_TTL } from '@/config/queryKeys';

export const useContributions = (username: string) =>
  useQuery({
    queryKey: QUERY_KEYS.CONTRIBUTIONS(username),
    queryFn: () => getContributions(username),
    staleTime: CACHE_TTL.CONTRIBUTIONS,
    enabled: !!username,
    select: data => data.user.contributionsCollection,
  });
