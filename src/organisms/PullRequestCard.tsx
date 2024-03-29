import { Card } from '~/atoms/cards/Card.js';
import { CardFooter } from '~/atoms/cards/CardFooter.js';
import { CardHeader } from '~/atoms/cards/CardHeader.js';
import { CheckStatusIcon } from '~/atoms/CheckStatusIcon.js';
import { IconText } from '~/atoms/IconText.js';
import { Id } from '~/atoms/Id.js';
import { Tag } from '~/atoms/tags/Tag.js';
import { Tags } from '~/atoms/tags/Tags.js';
import { CheckCircleIcon } from '~/icons/CheckCircleIcon.js';
import { CheckIcon } from '~/icons/CheckIcon.js';
import { CommentIcon } from '~/icons/CommentIcon.js';
import { XIcon } from '~/icons/XIcon.js';
import { CheckStatus } from '~/model/CheckStatus.js';
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
      {pullRequest.labels.length > 0 && (
        <Tags>
          {pullRequest.labels.map((label) => (
            <Tag key={label.name} text={label.name} color={label.color} />
          ))}
        </Tags>
      )}
      <CardFooter>
        <AvatarWithName user={pullRequest.author} />
        <RepoLink repository={pullRequest.repository} />
        {pullRequest.checkStatus === CheckStatus.SUCCESS && (
          <CheckStatusIcon checkStatus={CheckStatus.SUCCESS}>
            <CheckIcon />
          </CheckStatusIcon>
        )}
        {pullRequest.checkStatus === CheckStatus.ERROR && (
          <CheckStatusIcon checkStatus={CheckStatus.ERROR}>
            <XIcon />
          </CheckStatusIcon>
        )}
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
