import {MutableRefObject} from 'react';
import {DivRef, PointerData} from '../../../types/common';
import {moveRefElement} from '../../../utils/browser-utils';
import {inRange} from '../../../utils/funcs';
import {FSStateRef} from './types';

export const getDefaultPointerData = (): PointerData => ({
  clientY: 0,
  clientX: 0,
  deltaX: 0,
  deltaY: 0,
  startY: 0,
  startX: 0,
});

const horizontalKeys = {
  currKey: 'currHorizontal',
  totalKey: 'totalHorizontal',
  axisKey: 'x',
  lastDeltaKey: 'lastDeltaX',
  initialKey: 'initialX',
  sizeKey: 'slideWidth',
} as const;

const verticalKeys = {
  currKey: 'curr',
  totalKey: 'total',
  axisKey: 'y',
  initialKey: 'initialY',
  lastDeltaKey: 'lastDeltaY',
  sizeKey: 'slideHeight',
} as const;

export const getAxisKeys = (isHorizontal: boolean) =>
  isHorizontal ? horizontalKeys : verticalKeys;

export const getDefaultDragState = () => ({
  isDragging: false,
  isInitial: true,
  isHorizontal: false,
  initialY: 0,
  initialX: 0,
  lastDeltaY: 0,
  lastDeltaX: 0,
  direction: 0,
  isCloserToNextSection: true,
  isMovingTowardsNewSection: true,
  shouldChangeSection: false,
  hasSectionToShow: false,
});

export type DragState = ReturnType<typeof getDefaultDragState>;
export type DragStateRef = MutableRefObject<DragState>;

// TODO: REFACTOR TO ANOTHER FILE
export const updateScrollDirection = (
  delta: number,
  dragStateRef: DragStateRef,
  stateRef: FSStateRef,
  isHorizontal = false,
) => {
  const {lastDeltaKey, currKey, totalKey} = getAxisKeys(isHorizontal);
  const lastDelta = dragStateRef.current[lastDeltaKey];
  const curr = stateRef.current[currKey];
  const total = stateRef.current[totalKey];

  const direction = delta - lastDelta;
  dragStateRef.current.direction = direction;

  const isCloserToNextSection = delta < 0;
  dragStateRef.current.isCloserToNextSection = delta < 0;

  const isMovingTowardsNewSection =
    !direction || (isCloserToNextSection ? direction < 0 : direction > 0);

  dragStateRef.current.isMovingTowardsNewSection = isMovingTowardsNewSection;
  dragStateRef.current[lastDeltaKey] = delta;
  const hasSectionToShow = inRange(
    isCloserToNextSection ? curr + 1 : curr - 1,
    0,
    total ? total - 1 : 0,
  );

  dragStateRef.current.shouldChangeSection =
    hasSectionToShow && isMovingTowardsNewSection;
  dragStateRef.current.hasSectionToShow = hasSectionToShow;
};

export const initializeDrag = (
  x: number,
  y: number,
  dragStateRef: DragStateRef,
) => {
  dragStateRef.current.isHorizontal = Math.abs(x) > Math.abs(y);
  dragStateRef.current.isInitial = false;
};

export const scroll = ({
  dragStateRef,
  containerRef,
  swipeSectionRef,
  stateRef,
  delta,
  isHorizontal = false,
}: {
  delta: number;
  dragStateRef: DragStateRef;
  containerRef: DivRef;
  swipeSectionRef?: DivRef;
  stateRef: FSStateRef;
  isHorizontal: boolean;
}) => {
  const {hasSectionToShow} = dragStateRef.current;
  const {axisKey, initialKey} = getAxisKeys(isHorizontal);

  const ref = isHorizontal ? swipeSectionRef : containerRef;
  if (!ref?.current) {
    return;
  }
  const multiplier = hasSectionToShow ? 1 : 0.05;

  stateRef.current[axisKey] =
    dragStateRef.current[initialKey] + delta * multiplier;
  moveRefElement(ref, {[axisKey]: stateRef.current[axisKey]}, 'none');
};
