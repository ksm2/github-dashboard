import { useColorScheme } from '~/hooks/useColorScheme.js';
import { blend } from '~/utils/blend.js';
import './Tag.css';

interface Props {
  text: string;
  color: string;
}

export function Tag({ text, color }: Props) {
  const scheme = useColorScheme();

  const backgroundColor = `#${color}`;
  const borderColor = `#${blend(color, scheme === 'dark' ? 'FFFFFF' : '000000', 0.33)}`;
  return (
    <div className="Tag" title={text} style={{ backgroundColor: backgroundColor, borderColor }}>
      {text}
    </div>
  );
}
