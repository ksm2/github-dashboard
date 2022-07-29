import { IconProps, Icon } from '~/icons/Icon.js';

export function CheckCircleIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </Icon>
  );
}
