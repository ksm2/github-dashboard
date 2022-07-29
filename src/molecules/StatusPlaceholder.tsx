import { LanePlaceholder } from '~/atoms/lanes/LanePlaceholder.js';
import { CheckCircleIcon } from '~/icons/CheckCircleIcon.js';
import { DotsCircleIcon } from '~/icons/DotsCircleIcon.js';
import { ExclamationCircleIcon } from '~/icons/ExclamationCircleIcon.js';
import { XCircleIcon } from '~/icons/XCircleIcon.js';
import { Status } from '~/model/Status.js';

interface Props {
  status: Status;
}

export function StatusPlaceholder({ status }: Props) {
  switch (status) {
    case Status.OPEN: {
      return (
        <LanePlaceholder icon={<ExclamationCircleIcon />}>
          No new pull requests to be reviewed
        </LanePlaceholder>
      );
    }
    case Status.IN_REVIEW: {
      return (
        <LanePlaceholder icon={<DotsCircleIcon />}>
          No pull requests are being reviewed
        </LanePlaceholder>
      );
    }
    case Status.CHANGES_REQUESTED: {
      return (
        <LanePlaceholder icon={<XCircleIcon />}>No pull requests require changes</LanePlaceholder>
      );
    }
    case Status.APPROVED: {
      return (
        <LanePlaceholder icon={<CheckCircleIcon />}>No pull requests are approved</LanePlaceholder>
      );
    }
  }
}
