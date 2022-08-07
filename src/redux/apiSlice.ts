import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Filter } from '~/model/Filter.js';
import { FilterablePullRequest } from '~/model/FilterablePullRequest.js';
import { ensureTrailingSlash } from '~/utils/ensureTrailingSlash.js';

const baseUrl = new URL(location.href);
baseUrl.search = '';
baseUrl.pathname = ensureTrailingSlash(baseUrl.pathname) + 'api';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: baseUrl.toString() }),
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
