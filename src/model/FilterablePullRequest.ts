import { PullRequest } from './PullRequest.js';

export interface FilterablePullRequest extends PullRequest {
  filters: string[];
}
