import { Card } from '~/atoms/cards/Card.js';
import { CardFooter } from '~/atoms/cards/CardFooter.js';
import { CardHeader } from '~/atoms/cards/CardHeader.js';
import { IconText } from '~/atoms/IconText.js';
import { Id } from '~/atoms/Id.js';
import { CheckCircleIcon } from '~/icons/CheckCircleIcon.js';
import { CommentIcon } from '~/icons/CommentIcon.js';
import { PullRequest } from '~/model/PullRequest.js';
import { AvatarWithName } from '~/molecules/AvatarWithName.js';
import { RepoLink } from '~/molecules/RepoLink.js';
import { StatusIcon } from '~/molecules/StatusIcon.js';
import { pluralize } from '~/utils/pluralize.js';

interface Props {
  pullRequest: PullRequest;
}

export function PullRequestCard({ pullRequest }: Props) {
  return (
    <Card href={pullRequest.href}>
      <CardHeader>
        <StatusIcon status={pullRequest.status} />
        <h2 title={pullRequest.title}>{pullRequest.title}</h2>
        <Id>#{pullRequest.id}</Id>
      </CardHeader>
      <CardFooter>
        <AvatarWithName user={pullRequest.author} />
        <RepoLink repository={pullRequest.repository} />
        {pullRequest.approvalCount ? (
          <IconText
            icon={<CheckCircleIcon />}
            title={pluralize('This pull request has %d approval[s]', pullRequest.approvalCount)}
          >
            {pullRequest.approvalCount}
          </IconText>
        ) : pullRequest.commentCount ? (
          <IconText
            icon={<CommentIcon />}
            title={pluralize('This pull request has %d comment[s]', pullRequest.commentCount)}
          >
            {pullRequest.commentCount}
          </IconText>
        ) : null}
      </CardFooter>
    </Card>
  );
}
