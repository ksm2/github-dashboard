import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Filter } from '~/model/Filter.js';
import { FilterablePullRequest } from '~/model/FilterablePullRequest.js';
import { ensureTrailingSlash } from '~/utils/ensureTrailingSlash.js';

export const api = createApi({
  reducerPath: 'pokemonApi',
  baseQuery: fetchBaseQuery({ baseUrl: ensureTrailingSlash(location.href) + 'api' }),
  endpoints: (builder) => ({
    getFilters: builder.query<Filter[], void>({
      query: () => `filters`,
    }),
    getPullRequests: builder.query<FilterablePullRequest[], void>({
      query: () => 'pull-requests',
    }),
  }),
});

export const { useGetFiltersQuery, useGetPullRequestsQuery } = api;
