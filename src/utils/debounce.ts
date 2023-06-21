import {TimeoutTimerId} from '../types/common';

interface Options {
  ms?: number;
  leadingCall?: boolean;
  trailingCall?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  options: Options = {},
): ((...args: Parameters<T>) => void) => {
  const {ms = 200, leadingCall = false, trailingCall = true} = options;
  let timer: TimeoutTimerId;
  let lastArgs: Parameters<T>;
  let canCall = false;
  let leadingDone = false;
  return function innerFunc(...args) {
    lastArgs = args;

    if (leadingCall && !leadingDone) {
      leadingDone = true;
      func(...lastArgs);
      return;
    }

    if (canCall) {
      canCall = false;
      func(...lastArgs);
      return;
    }
    timer && clearTimeout(timer);
    timer = setTimeout(() => {
      canCall = true;
      trailingCall && innerFunc(...lastArgs);
    }, ms);
  };
};
