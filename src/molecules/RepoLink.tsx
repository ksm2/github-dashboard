import { ExtLink } from '~/atoms/ExtLink.js';
import { ArchiveIcon } from '~/icons/ArchiveIcon.js';
import './RepoLink.css';
import { Repository } from '~/model/Repository.js';

interface Props {
  repository: Repository;
}

export function RepoLink({ repository }: Props) {
  return (
    <ExtLink className="RepoLink" href={repository.href} title={repository.name}>
      <ArchiveIcon />
      <p>{repository.name}</p>
    </ExtLink>
  );
}
