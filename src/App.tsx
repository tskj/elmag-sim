import React from 'react';
import './App.css';
import { loop, initialState } from './sim';

export const App = () => {
  const canvasRef = React.useRef(null);
  React.useEffect(() => {
    const canvas: any = canvasRef.current;
    if (canvas) {
      loop(canvas.getContext('2d'), initialState)(0);
    }
  }, [canvasRef]);
  return (
    <div className='App'>
      <canvas id='canvas' ref={canvasRef} />
    </div>
  );
};
