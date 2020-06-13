import React, { useState, useCallback } from 'react';
import { useKeyDown } from './event-listeners';
import { Input } from './App';

type Props = {
  input: Input;
};

export const Settings = ({ input }: Props) => {
  const [vectorThickness, setVectorThickness] = useMutableState(
    input,
    'vectorThickness'
  );

  const shouldShow = useKeyboardShortcutsToDisplay();
  if (!shouldShow) return null;

  return (
    <div style={settingsPage}>
      Tjukkleik{' '}
      <input
        type='range'
        min='0'
        max='200'
        value={vectorThickness}
        onChange={(v) => setVectorThickness(parseInt(v.target.value, 10))}
      />
    </div>
  );
};

const useMutableState = <T, K extends keyof T>(
  ref: T,
  key: K
): [T[K], (x: T[K]) => void] => {
  const [value, setValue] = useState(ref[key]);
  return [
    value,
    (v) => {
      ref[key] = v;
      setValue(v);
    },
  ];
};

const useKeyboardShortcutsToDisplay = () => {
  const [shouldShow, setShouldShow] = useState(false);
  useKeyDown(
    'c',
    useCallback(() => {
      setShouldShow(true);
    }, [])
  );
  useKeyDown(
    'Escape',
    useCallback(() => {
      setShouldShow(false);
    }, [])
  );
  return shouldShow;
};

const settingsPage: any = {
  position: 'fixed',
  top: 30,
  right: 30,
  width: '300px',
  height: '400px',
  padding: '20px',
  backgroundColor: '#eee',
  boxShadow: '3px 3px 1px 0px rgba(0,0,0,0.1)',
};
