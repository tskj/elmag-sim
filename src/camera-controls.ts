import { Input } from './App';
import {
  useIsHoldingKey,
  useIsDraggin,
  useEventListener,
} from './event-listeners';
import { useCallback } from 'react';
import { State, Camera } from './sim';
import { screenToWorldSpace } from './draw';

const space = ' ';

export const useDrag = (input: Input) => {
  const { canvas } = input;
  const holdingSpace = useIsHoldingKey(space);
  const dragging = useIsDraggin(canvas, { allowedToDrag: holdingSpace });
  useEventListener(
    'mousemove',
    useCallback(
      (e: MouseEvent) => {
        if (dragging && input.mouse.dragStartPosition === undefined) {
          input.mouse.dragStartPosition = { x: e.clientX, y: e.clientY };
        }
        if (!dragging && input.mouse.dragStartPosition) {
          input.mouse.dragStartPosition = undefined;
        }
        input.mouse.position.x = e.clientX;
        input.mouse.position.y = e.clientY;
      },
      [dragging, input]
    )
  );
};

export const useZoom = (input: Input) => {
  useEventListener(
    'wheel',
    useCallback(
      (wheel) => {
        input.mouse.scrollSpeed = wheel.deltaY;
      },
      [input]
    )
  );
};

const clamp = (
  n: number,
  { lowerBound, upperBound }: { lowerBound?: number; upperBound?: number }
) =>
  lowerBound && n < lowerBound
    ? lowerBound
    : upperBound && n > upperBound
    ? upperBound
    : n;

export const updateCamera = (
  { mouse, canvasSize }: Input,
  { camera }: State
): Camera => {
  const project = screenToWorldSpace(camera, canvasSize);

  if (mouse.scrollSpeed) {
    return {
      ...camera,
      zoom: clamp(camera.zoom + mouse.scrollSpeed / 50, {
        lowerBound: 10,
      }),
    };
  }

  if (!mouse.dragStartPosition) {
    return { ...camera, moveStartPosition: undefined };
  }

  const dragPosition = project(mouse.position);
  const dragOrigin = project(mouse.dragStartPosition);
  const dragDistance = {
    x: dragPosition.x - dragOrigin.x,
    y: dragPosition.y - dragOrigin.y,
  };
  const moveStartPosition = camera.moveStartPosition || camera.position;
  return {
    ...camera,
    position: {
      x: moveStartPosition.x - dragDistance.x,
      y: moveStartPosition.y - dragDistance.y,
    },
    moveStartPosition,
  };
};
