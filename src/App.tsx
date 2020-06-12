import React from 'react';
import './App.css';
import { loop, initialState } from './sim';

export type Input = {
  ctx: CanvasRenderingContext2D;
  size: { width: number; height: number };
};

export let input = {
  ctx: undefined as any,
  size: { width: 0, height: 0 },
};

export const App = () => {
  const canvasRef = React.useRef(null);
  React.useEffect(() => {
    const canvas: any = canvasRef.current;
    if (canvas) {
      canvas.width = canvas.scrollWidth;
      canvas.height = canvas.scrollHeight;
      input = {
        ctx: canvas.getContext('2d'),
        size: {
          width: canvas.scrollWidth,
          height: canvas.scrollHeight,
        },
      };
      loop(initialState)(0);
    }
  }, [canvasRef]);
  return (
    <div className='App'>
      <canvas id='canvas' ref={canvasRef} />
    </div>
  );
};
