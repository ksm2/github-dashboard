import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Filter } from '~/model/Filter.js';
import { PullRequest } from '~/model/PullRequest.js';

export const api = createApi({
  reducerPath: 'pokemonApi',
  baseQuery: fetchBaseQuery({ baseUrl: location.origin + '/api' }),
  endpoints: (builder) => ({
    getFilters: builder.query<Filter[], void>({
      query: () => `filters`,
    }),
    getPullRequests: builder.query<PullRequest[], void>({
      query: () => 'pull-requests',
    }),
  }),
});

export const { useGetFiltersQuery, useGetPullRequestsQuery } = api;
