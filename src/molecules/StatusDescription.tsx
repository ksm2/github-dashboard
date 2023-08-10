import { LaneHeader } from '~/atoms/lanes/LaneHeader.js';
import { Status } from '~/model/Status.js';

interface Props {
  status: Status;
}

export function StatusDescription({ status }: Props) {
  switch (status) {
    case Status.DRAFT: {
      return <LaneHeader>Pull requests in draft</LaneHeader>;
    }
    case Status.OPEN: {
      return <LaneHeader>Pull requests without a review</LaneHeader>;
    }
    case Status.IN_REVIEW: {
      return <LaneHeader>Pull requests being reviewed</LaneHeader>;
    }
    case Status.CHANGES_REQUESTED: {
      return <LaneHeader>Pull requests with requested changes</LaneHeader>;
    }
    case Status.APPROVED: {
      return <LaneHeader>Pull requests with approvals</LaneHeader>;
    }
  }
}
