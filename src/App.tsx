import React from 'react';
import './App.css';
import { loop, initialState } from './sim';

export type Input = {
  ctx: CanvasRenderingContext2D;
  canvasSize: { width: number; height: number };
  vectorThickness: number;
};

export let input: Input = {
  ctx: undefined as any,
  canvasSize: { width: 0, height: 0 },
  vectorThickness: 20,
};

export const App = () => {
  const canvasRef = React.useRef(null);
  React.useEffect(() => {
    const canvas: any = canvasRef.current;
    if (canvas) {
      canvas.width = canvas.scrollWidth;
      canvas.height = canvas.scrollHeight;
      input = {
        ...input,
        ctx: canvas.getContext('2d'),
        canvasSize: {
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
