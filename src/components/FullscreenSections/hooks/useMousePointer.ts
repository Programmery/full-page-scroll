import {useRef} from 'react';
import {useMount} from 'react-use';
import {isTouchDevice} from '../../../utils/browser-utils';
import {getDefaultPointerData} from './utils';
import {MemoRef} from './types';

export const useMousePointer = (memoRef: MemoRef) => {
  const stateRef = useRef(getDefaultPointerData());
  useMount(() => {
    if (isTouchDevice) {
      return;
    }

    const handleMouseMove = ({clientY, clientX}: MouseEvent) => {
      stateRef.current.clientX = clientX;
      stateRef.current.clientY = clientY;
      stateRef.current.deltaX = clientX - stateRef.current.startX;
      stateRef.current.deltaY = clientY - stateRef.current.startY;
      memoRef.current.onDrag?.(stateRef.current);
    };
    const handleMouseDown = ({clientY, clientX}: MouseEvent) => {
      // TODO: IMPLEMENT IS DRAGGABLE (NOT A BUTTON OR INPUT)
      // const target = e.target as HTMLElement | null;
      // console.log(e.target, e.composedPath, e.path, target.tagName);
      stateRef.current.startX = clientX;
      stateRef.current.startY = clientY;
      memoRef.current.onDragStart?.(stateRef.current);
      document.addEventListener('mousemove', handleMouseMove);
    };
    const handleMouseUp = () => {
      memoRef.current.onDragEnd?.(stateRef.current);
      stateRef.current = getDefaultPointerData();
      document.removeEventListener('mousemove', handleMouseMove);
    };
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseUp);
    // eslint-disable-next-line consistent-return
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseUp);
    };
  });
};
