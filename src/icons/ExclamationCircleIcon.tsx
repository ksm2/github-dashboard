import { IconProps, Icon } from '~/icons/Icon.js';

export function ExclamationCircleIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </Icon>
  );
}
