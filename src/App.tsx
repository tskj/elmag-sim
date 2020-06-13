import React, { useState, useCallback } from 'react';
import { loop, initialState } from './sim';
import { useDrag, useZoom, useResizableView } from './camera-controls';
import { R2 } from './fields';
import { Settings } from './Settings';

export type Input = {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  canvasSize: { width: number; height: number };
  vectorThickness: number;
  mouse: { dragStartPosition?: R2; position: R2; scrollSpeed: number };
};

export let input: Input = {
  canvas: undefined as any,
  ctx: undefined as any,
  canvasSize: { width: 0, height: 0 },
  vectorThickness: 20,
  mouse: { position: { x: 0, y: 0 }, scrollSpeed: 0 },
};

export const App = () => {
  const { render } = useRender();
  const canvasRef = React.useRef(null);
  React.useEffect(() => {
    const canvas: any = canvasRef.current;
    if (canvas) {
      input = {
        ...input,
        canvas,
        ctx: canvas.getContext('2d'),
      };
      start(loop(initialState));
      render();
    }
  }, [canvasRef, render]);

  useDrag(input);
  useZoom(input);
  useResizableView(input);

  return (
    <div className='App'>
      <canvas id='canvas' ref={canvasRef} />
      <Settings input={input} />
    </div>
  );
};

const useRender = () => {
  const [, setBit] = useState(false);
  return { render: useCallback(() => setBit((bit) => !bit), []) };
};

const start = (f: () => void) => f();
