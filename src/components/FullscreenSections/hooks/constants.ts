import {PointerData} from '../../../types/common';

export const getDefaultPointerData = (): PointerData => ({
  clientY: 0,
  clientX: 0,
  deltaX: 0,
  deltaY: 0,
  startY: 0,
  startX: 0,
});
