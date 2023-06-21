import {MutableRefObject} from 'react';
import {Callback, DivRef, PointerData} from '../../../types/common';

export interface FSState {
  curr: number;
  total: number;
  currHorizontal: number;
  totalHorizontal: number;
  y: number;
  x: number;
  slideHeight: number;
  slideWidth: number;
}

export type FSStateRef = MutableRefObject<FSState>;
export interface CommonFSParams {
  stateRef: FSStateRef;
}

export interface DragCallbacks {
  onDragStart?: Callback<PointerData>;
  onDrag?: Callback<PointerData>;
  onDragEnd?: Callback<PointerData>;
}

export interface MemoValues extends DragCallbacks {
  changeSection: ChangeSectionFunc;
  containerRef: DivRef;
  swipeSectionRef?: DivRef;
}

export type MemoRef = MutableRefObject<MemoValues>;

export type ChangeSectionFunc = (
  direction: number,
  isHorizontal: boolean,
) => void;

export type SkipToSectionFunc = (
  direction: 'start' | 'end',
  isHorizontal: boolean,
) => void;
