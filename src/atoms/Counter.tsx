import './Counter.css';

interface Props {
  number: number;
}

export function Counter({ number }: Props) {
  if (!number) {
    return null;
  }

  return <div className="Counter">{number}</div>;
}
