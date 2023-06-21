import {useMemo, useRef} from 'react';
import {PointerData} from '../../../types/common';
import {animateCss} from '../../../utils/browser-utils';
import {MemoRef, CommonFSParams} from './types';
import {useSinglePointer} from './useSinglePointer';
import {
  getAxisKeys,
  getDefaultDragState,
  initializeDrag,
  scroll,
  updateScrollDirection,
} from './utils';

interface Params extends CommonFSParams {
  memoRef: MemoRef;
}

export const useDrag = ({stateRef, memoRef}: Params) => {
  const dragStateRef = useRef(getDefaultDragState());

  const {onDragStart, onDrag, onDragEnd} = useMemo(
    () => ({
      onDragStart: () => {
        dragStateRef.current.initialX = stateRef.current.x;
        dragStateRef.current.initialY = stateRef.current.y;
        dragStateRef.current.isDragging = true;
        dragStateRef.current.isInitial = true;
      },
      onDrag: ({deltaX, deltaY}: PointerData) => {
        const {isDragging, isInitial, isHorizontal} = dragStateRef.current;
        if (isInitial && !deltaX && !deltaY) {
          return;
        }

        if (!isDragging) {
          return;
        }
        const delta = isHorizontal ? deltaX : deltaY;
        updateScrollDirection(delta, dragStateRef, stateRef, isHorizontal);
        if (isInitial) {
          initializeDrag(deltaX, deltaY, dragStateRef);
          return;
        }

        scroll({
          delta,
          dragStateRef,
          stateRef,
          containerRef: memoRef.current.containerRef,
          swipeSectionRef: memoRef.current.swipeSectionRef,
          isHorizontal,
        });
      },
      onDragEnd: ({deltaY, deltaX}: PointerData) => {
        const {
          initialY,
          initialX,
          isDragging: wasDragging,
          shouldChangeSection,
          isCloserToNextSection,
          hasSectionToShow,
          isHorizontal: wasHorizontal,
        } = dragStateRef.current;
        dragStateRef.current = getDefaultDragState();
        const delta = wasHorizontal ? deltaX : deltaY;
        const initialAxis = wasHorizontal ? initialX : initialY;
        const {sizeKey, axisKey} = getAxisKeys(wasHorizontal);
        const ref = wasHorizontal
          ? memoRef.current.swipeSectionRef
          : memoRef.current.containerRef;
        if (!ref?.current) {
          return;
        }
        if (!wasDragging) {
          return;
        }

        if (
          !shouldChangeSection ||
          Math.abs(delta) <= stateRef.current[sizeKey] * 0.03
        ) {
          stateRef.current[axisKey] = initialAxis;
          animateCss(ref, {
            coordinates: {[axisKey]: initialAxis},
            animationDuration: hasSectionToShow ? undefined : 200,
          });
          return;
        }
        memoRef.current.changeSection(
          isCloserToNextSection ? 1 : -1,
          wasHorizontal,
        );
      },
    }),
    [memoRef, stateRef],
  );

  // UPDATE CALLBACKS
  memoRef.current.onDragStart = onDragStart;
  memoRef.current.onDrag = onDrag;
  memoRef.current.onDragEnd = onDragEnd;
  useSinglePointer(memoRef);
};
