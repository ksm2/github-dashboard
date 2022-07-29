import './AvatarWithName.css';
import { ExtLink } from '~/atoms/ExtLink.js';
import { User } from '~/model/User.js';

interface Props {
  user: User;
}

export function AvatarWithName({ user }: Props) {
  return (
    <ExtLink className="AvatarWithName" href={user.href} title={user.name}>
      <img alt={user.name} src={user.avatarSrc} />
      <p>{user.name}</p>
    </ExtLink>
  );
}
