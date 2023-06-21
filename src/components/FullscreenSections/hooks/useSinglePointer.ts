import {MemoRef} from './types';
import {useMousePointer} from './useMousePointer';
import {useTouchPointer} from './useTouchPointer';

export const useSinglePointer = (memoRef: MemoRef) => {
  useMousePointer(memoRef);
  useTouchPointer(memoRef);
};
