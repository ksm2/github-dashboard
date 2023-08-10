import { CheckCircleIcon } from '~/icons/CheckCircleIcon.js';
import { DotsCircleIcon } from '~/icons/DotsCircleIcon.js';
import { ExclamationCircleIcon } from '~/icons/ExclamationCircleIcon.js';
import { PauseCircleIcon } from '~/icons/PauseCircleIcon.js';
import { XCircleIcon } from '~/icons/XCircleIcon.js';
import { Status } from '~/model/Status.js';
import './StatusIcon.css';

interface Props {
  status: Status;
}

export function StatusIcon({ status }: Props) {
  switch (status) {
    case Status.DRAFT: {
      return <PauseCircleIcon className="StatusIcon Draft" />;
    }
    case Status.OPEN: {
      return <ExclamationCircleIcon className="StatusIcon Open" />;
    }
    case Status.IN_REVIEW: {
      return <DotsCircleIcon className="StatusIcon InReview" />;
    }
    case Status.APPROVED: {
      return <CheckCircleIcon className="StatusIcon Approved" />;
    }
    case Status.CHANGES_REQUESTED: {
      return <XCircleIcon className="StatusIcon ChangesRequested" />;
    }
  }
}
