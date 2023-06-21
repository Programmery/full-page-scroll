import {TimeoutTimerId} from '../types/common';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  timeout = 200,
): ((...args: Parameters<T>) => void) => {
  let timer: TimeoutTimerId | null;
  let canCall = true;
  let lastArgs: Parameters<T>;
  return function innerFunc(...args) {
    lastArgs = args;
    if (canCall) {
      func(...lastArgs);
      canCall = false;
      return;
    }

    if (timer) {
      return;
    }
    timer = setTimeout(() => {
      timer = null;
      canCall = true;
      innerFunc(...lastArgs);
    }, timeout);
  };
};
