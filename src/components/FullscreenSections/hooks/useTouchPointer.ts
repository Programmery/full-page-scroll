import {useRef} from 'react';
import {useMount} from 'react-use';
import {detectPageZoom, isTouchDevice} from '../../../utils/browser-utils';
import {getDefaultPointerData} from './utils';
import {MemoRef} from './types';

const preventNativeZoom = (e?: Event): void => {
  if (e?.cancelable && !detectPageZoom()) {
    e.preventDefault();
  }
};

export const useTouchPointer = (memoRef: MemoRef) => {
  const stateRef = useRef(getDefaultPointerData());
  useMount(() => {
    if (!isTouchDevice) {
      return;
    }
    document.addEventListener('gesturestart', preventNativeZoom);
    const handleTouchMove = ({touches}: TouchEvent) => {
      if (!touches.length || touches.length > 1) {
        handleTouchEnd();
      }
      const {clientY, clientX} = touches[0];
      stateRef.current.clientX = clientX;
      stateRef.current.clientY = clientY;
      stateRef.current.deltaX = clientX - stateRef.current.startX;
      stateRef.current.deltaY = clientY - stateRef.current.startY;
      memoRef.current.onDrag?.(stateRef.current);
    };
    const handleTouchStart = ({touches}: TouchEvent) => {
      if (!touches.length || touches.length > 1) {
        return;
      }
      const {clientX, clientY} = touches[0];
      stateRef.current.startX = clientX;
      stateRef.current.startY = clientY;
      memoRef.current.onDragStart?.(stateRef.current);
    };
    const handleTouchEnd = () => {
      memoRef.current.onDragEnd?.(stateRef.current);
      stateRef.current = getDefaultPointerData();
    };
    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);
    document.addEventListener('touchcancel', handleTouchEnd);
    document.addEventListener('touchmove', handleTouchMove);
    // eslint-disable-next-line consistent-return
    return () => {
      document.removeEventListener('gesturestart', preventNativeZoom);

      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('touchcancel', handleTouchEnd);
      document.removeEventListener('touchmove', handleTouchMove);
    };
  });
};
