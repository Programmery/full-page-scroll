import {useRef} from 'react';
import {useMount} from 'react-use';
import {
  getPressedKey,
  isTouchDevice,
  preventDefault,
} from '../../../utils/browser-utils';
import {MemoRef} from './types';

interface HookParams {
  memoRef: MemoRef;
}

interface WheelState {
  isGoingDown: boolean;
  isAccelerating: boolean;
  lastDelta: number;
  //   isNewScroll: boolean;
  waitForMoreAccelerationChanges: 5;
  canGoDown: boolean;
  canGoUp: boolean;
}
export const useScrollEvents = ({memoRef}: HookParams): void => {
  const wheelStateRef = useRef<WheelState>({
    isGoingDown: true,
    isAccelerating: false,
    lastDelta: 0,
    waitForMoreAccelerationChanges: 5,
    canGoDown: true,
    canGoUp: true,
  });
  useMount(() => {
    // TOUCH DEVICES USE DRAG INSTEAD OF SCROLL AND NO KEYBOARD EVENTS
    if (isTouchDevice) {
      return;
    }
    const handleWheel = (e: Event | WheelEvent): void => {
      if (!('deltaY' in e)) {
        return;
      }
      const {
        isGoingDown: wasGoingDown,
        isAccelerating: wasAccelerating,
        lastDelta,
        canGoDown,
        canGoUp,
      } = wheelStateRef.current;

      // Preventing unnecessary calculations
      if (wasGoingDown) {
        if (!canGoDown) return;
      } else if (!canGoUp) {
        return;
      }

      const delta = -e.deltaY ?? -e.detail;
      wheelStateRef.current.lastDelta = delta;
      wheelStateRef.current.isGoingDown = delta < 0;

      const newAcceleration = wasGoingDown
        ? lastDelta > delta
        : lastDelta < delta;

      const accelerationChanged = newAcceleration !== wasAccelerating;
      // Cant change right away, need to wait for consistency
      if (accelerationChanged) {
        wheelStateRef.current.waitForMoreAccelerationChanges -= 1;
      }
      if (!wheelStateRef.current.waitForMoreAccelerationChanges) {
        wheelStateRef.current.waitForMoreAccelerationChanges = 5;
        wheelStateRef.current.isAccelerating = newAcceleration;
      }

      const isNewScroll =
        !wasAccelerating && wheelStateRef.current.isAccelerating;

      if (!isNewScroll) {
        return;
      }
      // NEW SCROLL
      wheelStateRef.current.waitForMoreAccelerationChanges = 5;
      const {isGoingDown} = wheelStateRef.current;

      const keyName: 'canGoDown' | 'canGoUp' = isGoingDown
        ? 'canGoDown'
        : 'canGoUp';

      // PREVENT FREQUENT CALLS
      if (!wheelStateRef.current[keyName]) {
        return;
      }
      memoRef.current.changeSection?.(isGoingDown ? 1 : -1, false);
      wheelStateRef.current[keyName] = false;
      setTimeout(() => {
        wheelStateRef.current[keyName] = true;
      }, 400);
    };
    const keydownHandler = (e: KeyboardEvent): void => {
      const key = getPressedKey(e);
      const {changeSection} = memoRef.current;
      if (!changeSection) {
        return;
      }
      if (key === 'ArrowDown') {
        preventDefault(e);
        changeSection(1, false);
        return;
      }
      if (key === 'ArrowUp') {
        preventDefault(e);
        changeSection(-1, false);
        return;
      }
      if (key === 'ArrowRight') {
        preventDefault(e);
        changeSection(1, true);
        return;
      }
      if (key === 'ArrowLeft') {
        preventDefault(e);
        changeSection(-1, true);
      }
    };

    window.addEventListener('wheel', handleWheel);
    window.addEventListener('keydown', keydownHandler);

    // eslint-disable-next-line consistent-return
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', keydownHandler);
    };
  });
};

// TODO: WITH THROTTLE BUT MAYBE LESS RESPONSIVE
//  const handleWheel = (e: Event | WheelEvent): void => {
//    if (!('deltaY' in e)) {
//      return;
//    }
//    const {
//      isGoingDown: wasGoingDown,
//      isAccelerating: wasAccelerating,
//      lastDelta,
//      canGoDown,
//      canGoUp,
//    } = wheelStateRef.current;

//    // Preventing unnecessary calculations
//    if (wasGoingDown) {
//      if (!canGoDown) return;
//    } else if (!canGoUp) {
//      return;
//    }

//    const delta = -e.deltaY ?? -e.detail;
//    console.log(delta);
//    wheelStateRef.current.lastDelta = delta;
//    wheelStateRef.current.isGoingDown = delta < 0;

//    const newAcceleration = wasGoingDown ? lastDelta > delta : lastDelta < delta;

//    wheelStateRef.current.isAccelerating = newAcceleration;

//    const isNewScroll = !wasAccelerating && wheelStateRef.current.isAccelerating;

//    if (!isNewScroll) {
//      return;
//    }
//    // NEW SCROLL
//    wheelStateRef.current.waitForMoreAccelerationChanges = 5;
//    const {isGoingDown} = wheelStateRef.current;

//    const keyName: 'canGoDown' | 'canGoUp' = isGoingDown
//      ? 'canGoDown'
//      : 'canGoUp';

//    // PREVENT FREQUENT CALLS
//    if (!wheelStateRef.current[keyName]) {
//      return;
//    }
//    isGoingDown ? onGoDown?.() : onGoUp?.();
//    wheelStateRef.current[keyName] = false;
//    setTimeout(() => {
//      wheelStateRef.current[keyName] = true;
//    }, 400);
//  };
//  const keydownHandler = (e: KeyboardEvent): void => {
//    const key = getPressedKey(e);
//    if (key === 'ArrowDown') {
//      preventDefault(e);
//      return onGoDown?.();
//    }
//    if (key === 'ArrowUp') {
//      preventDefault(e);
//      return onGoUp?.();
//    }
//  };

//  !isTouchDevice && window.addEventListener('wheel', throttle(handleWheel, 80));
