import {useCallback, useEffect, useRef} from 'react';
import {useLockBodyScroll} from 'react-use';
import {useDebouncedWindowSize} from '../../../hooks/useDebouncedWindowSize';
import {Callback, DivRef, SectionsData} from '../../../types/common';
import {animateCss, moveRefElement} from '../../../utils/browser-utils';
import {doNothing, inRange} from '../../../utils/funcs';
import {MemoRef, ChangeSectionFunc, FSState, SkipToSectionFunc} from './types';
import {useDrag} from './useDrag';
import {useScrollEvents} from './useScrollEvents';
import {getAxisKeys} from './utils';

export interface HookParams {
  containerRef: DivRef;
  sections: SectionsData[];
  setCurrSection?: Callback<number>;
}

export const useFullscreenScroll = ({
  containerRef,
  sections,
  setCurrSection,
}: HookParams) => {
  useLockBodyScroll();

  const {height, width} = useDebouncedWindowSize({debounceMs: 100});
  const sectionsLength = sections.length;
  const stateRef = useRef<FSState>({
    curr: 0,
    total: sectionsLength,
    currHorizontal: 0,
    totalHorizontal: sections[0]?.horizontalSectionsCount || 0,
    y: 0,
    x: 0,
    slideWidth: width,
    slideHeight: height,
  });

  const {curr: currentSection} = stateRef.current;
  const horizontalSectionsLength =
    sections[currentSection]?.horizontalSectionsCount || 0;

  // KEEPING STATE UP TO DATE
  stateRef.current.slideHeight = height;
  stateRef.current.slideWidth = width;
  stateRef.current.total = sectionsLength;
  stateRef.current.totalHorizontal = horizontalSectionsLength;

  const swipeSectionRef = sections[currentSection]?.swipeRef;

  // Keeping things up to date without triggering dependency arrays
  const memoRef: MemoRef = useRef({
    changeSection: doNothing,
    swipeSectionRef,
    containerRef,
  });
  // NOTE: Have to manually update this object, when callbacks are created / updated, like so:
  memoRef.current.containerRef = containerRef;
  memoRef.current.swipeSectionRef = swipeSectionRef;

  const goToSection = useCallback(
    (i: number, isHorizontal = false) => {
      const {totalKey, axisKey, currKey, sizeKey} = getAxisKeys(isHorizontal);
      const ref = isHorizontal
        ? memoRef.current.swipeSectionRef
        : memoRef.current.containerRef;
      const total = stateRef.current[totalKey];
      const newCurr = i;
      if (!ref?.current || !inRange(newCurr, 0, total ? total - 1 : 0)) {
        return;
      }

      stateRef.current[currKey] = newCurr;
      stateRef.current[axisKey] =
        -stateRef.current[currKey] * stateRef.current[sizeKey];

      !isHorizontal && setCurrSection?.(newCurr);
      animateCss(ref, {
        coordinates: {[axisKey]: stateRef.current[axisKey]},
      });
    },
    [setCurrSection, memoRef],
  );

  const changeSection: ChangeSectionFunc = useCallback(
    (direction: number, isHorizontal = false) => {
      const {currKey} = getAxisKeys(isHorizontal);
      const curr = stateRef.current[currKey];
      const newCurr = curr + direction;
      goToSection(newCurr, isHorizontal);
    },
    [goToSection],
  );
  // Updating changeSection cb after creation
  memoRef.current.changeSection = changeSection;

  const skipTo: SkipToSectionFunc = useCallback(
    (direction, isHorizontal = false) => {
      if (direction === 'start') {
        goToSection(0, isHorizontal);
        return;
      }
      const {totalKey} = getAxisKeys(isHorizontal);
      const total = stateRef.current[totalKey];
      goToSection(total - 1, isHorizontal);
    },
    [goToSection],
  );

  useScrollEvents({memoRef});

  useDrag({stateRef, memoRef});

  // TODO: refactor this into its own hook?
  useEffect(() => {
    const {containerRef: ref} = memoRef.current;
    if (!ref.current) {
      return;
    }
    stateRef.current.slideHeight = height;
    stateRef.current.y = -stateRef.current.curr * stateRef.current.slideHeight;
    moveRefElement(ref, {y: stateRef.current.y}, 'none');
  }, [height, memoRef]);
  useEffect(() => {
    const {swipeSectionRef: ref} = memoRef.current;
    if (!ref?.current) {
      return;
    }
    stateRef.current.slideWidth = width;
    stateRef.current.x =
      -stateRef.current.currHorizontal * stateRef.current.slideWidth;
    moveRefElement(ref, {x: stateRef.current.x}, 'none');
  }, [width, memoRef]);

  return {goToSection, changeSection, skipTo};
};
