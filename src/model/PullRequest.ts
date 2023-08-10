import { CheckStatus } from './CheckStatus.js';
import { Label } from './Label.js';
import { Repository } from './Repository.js';
import { Status } from './Status.js';
import { User } from './User.js';

export interface PullRequest {
  href: string;
  title: string;
  id: string;
  status: Status;
  checkStatus: CheckStatus;
  author: User;
  repository: Repository;
  commentCount: number;
  approvalCount: number;
  labels: Label[];
}
