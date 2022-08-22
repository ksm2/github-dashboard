import { MouseEvent, ReactNode, useRef } from 'react';

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
    const ref = useRef<HTMLDivElement | null>(null);

    function handleClick(e: MouseEvent) {
      let el = e.target;
      while (
        el instanceof HTMLElement &&
        !(el instanceof HTMLAnchorElement) &&
        el.parentElement &&
        el !== ref.current
      ) {
        el = el.parentElement;
      }

      if (el === ref.current) {
        e.stopPropagation();
        window.open(props.href, '_blank', 'popup=false,nofollow,noopener,noreferrer');
      }
    }

    return (
      <div ref={ref} tabIndex={0} style={{ cursor: 'pointer' }} onClick={handleClick} {...props}>
        {children}
      </div>
    );
  }
}
