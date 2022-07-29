import { AvatarWithName } from '~/molecules/AvatarWithName.js';
import { Card } from '~/atoms/cards/Card.js';
import { CardFooter } from '~/atoms/cards/CardFooter.js';
import { CardHeader } from '~/atoms/cards/CardHeader.js';
import { CommentCounter } from '~/molecules/CommentCounter.js';
import { Id } from '~/atoms/Id.js';
import { RepoLink } from '~/molecules/RepoLink.js';
import { PullRequest } from '~/model/PullRequest.js';
import { StatusIcon } from '~/molecules/StatusIcon.js';

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
        {pullRequest.commentCounter ? (
          <CommentCounter>{pullRequest.commentCounter}</CommentCounter>
        ) : null}
      </CardFooter>
    </Card>
  );
}
