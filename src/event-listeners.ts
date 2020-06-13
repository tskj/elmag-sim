import { useEffect, useCallback, useState } from 'react';

export const useEventListener = (
  eventType: string,
  onEventTrigger: React.EventHandler<any>
) => {
  useEffect(() => {
    window.addEventListener(eventType, onEventTrigger, false);
    return () => window.removeEventListener(eventType, onEventTrigger, false);
  }, [eventType, onEventTrigger]);
};

export const useKeyDown = (key: string, onKeyDown: () => void) => {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === key) {
        onKeyDown();
      }
    },
    [key, onKeyDown]
  );
  useEventListener('keydown', handleKeyDown);
};

export const useKeyUp = (key: string, onKeyUp: () => void) => {
  const handleKeyUp = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === key) {
        onKeyUp();
      }
    },
    [key, onKeyUp]
  );
  useEventListener('keyup', handleKeyUp);
};

export const useMouseDown = (onMouseDown: (e: MouseEvent) => void) => {
  useEventListener(
    'mousedown',
    useCallback(
      (e: MouseEvent) => {
        if (e.button === 0) {
          onMouseDown(e);
        }
      },
      [onMouseDown]
    )
  );
};

export const useMouseUp = (onMouseUp: (e: MouseEvent) => void) => {
  useEventListener(
    'mouseup',
    useCallback(
      (e: MouseEvent) => {
        if (e.button === 0) {
          onMouseUp(e);
        }
      },
      [onMouseUp]
    )
  );
};

export const useIsHoldingKey = (key: string) => {
  const [isHolding, setIsHolding] = useState(false);
  useKeyDown(
    key,
    useCallback(() => {
      if (!isHolding) {
        setIsHolding(true);
      }
    }, [isHolding])
  );
  useKeyUp(
    key,
    useCallback(() => {
      setIsHolding(false);
    }, [])
  );
  return isHolding;
};

export const useIsDraggin = (
  target: HTMLElement,
  { allowedToDrag = true }: { allowedToDrag?: boolean }
) => {
  const [isDragging, setIsDragging] = useState(false);
  useMouseDown(
    useCallback(
      (e) => {
        if (e.target === target && allowedToDrag) {
          setIsDragging(true);
        }
      },
      [target, allowedToDrag]
    )
  );
  useMouseUp(
    useCallback(() => {
      setIsDragging(false);
    }, [])
  );
  return isDragging;
};
