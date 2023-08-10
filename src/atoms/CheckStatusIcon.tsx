import './CheckStatusIcon.css';
import classNames from 'classnames';
import { ReactNode } from 'react';
import { CheckStatus } from '~/model/CheckStatus.js';

interface Props {
  checkStatus: CheckStatus;
  children?: ReactNode;
}

export function CheckStatusIcon({ children, checkStatus }: Props) {
  return <div className={classNames('CheckStatusIcon', CheckStatus[checkStatus])}>{children}</div>;
}
