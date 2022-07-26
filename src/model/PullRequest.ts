import { Label } from '~/model/Label.js';
import { Repository } from '~/model/Repository.js';
import { User } from '~/model/User.js';
import { Status } from './Status.js';

export interface PullRequest {
  href: string;
  title: string;
  id: string;
  status: Status;
  author: User;
  repository: Repository;
  commentCount: number;
  approvalCount: number;
  labels: Label[];
}
