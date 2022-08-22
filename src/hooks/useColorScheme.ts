import { useLayoutEffect, useRef, useState } from 'react';

export function useColorScheme(): 'dark' | 'light' {
  const colorSchemeQueryList = useRef(window.matchMedia('(prefers-color-scheme: dark)'));
  const [dark, setDark] = useState(colorSchemeQueryList.current.matches);

  useLayoutEffect(() => {
    function handleChange(e: MediaQueryListEvent) {
      setDark(e.matches);
    }

    colorSchemeQueryList.current.addEventListener('change', handleChange);
    return () => {
      colorSchemeQueryList.current.removeEventListener('change', handleChange);
    };
  }, []);

  return dark ? 'dark' : 'light';
}
