import { ReactNode } from 'react';

interface Props {
  className?: string;
  title?: string;
  href: string;
  tagName?: 'a' | 'div';
  children: ReactNode;
}

export function ExtLink({ tagName = 'a', children, ...props }: Props) {
  if (tagName === 'a') {
    return (
      <a target="_blank" rel="nofollow noopener noreferrer" {...props}>
        {children}
      </a>
    );
  } else {
    function handleClick() {
      window.open(props.href, '_blank', 'popup=false,nofollow,noopener,noreferrer');
    }

    return (
      <div tabIndex={0} style={{ cursor: 'pointer' }} onClick={handleClick} {...props}>
        {children}
      </div>
    );
  }
}
