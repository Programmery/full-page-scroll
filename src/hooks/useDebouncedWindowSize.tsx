import {useCallback, useEffect, useMemo} from 'react';
import useRafState from 'react-use/lib/useRafState';
import {on, off} from '../utils/browser-utils';
import {debounce} from '../utils/debounce';

export const useDebouncedWindowSize = ({debounceMs}: {debounceMs?: number}) => {
  const [state, setState] = useRafState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const handler = useCallback(() => {
    setState({
      width: window.innerWidth,
      height: window.innerHeight,
    });
    // TODO: CHECK THIS
  }, [setState]);

  const debouncedHandler = useMemo(() => debounce(handler, {ms: debounceMs}), [
    debounceMs,
    handler,
  ]);

  useEffect((): (() => void) | void => {
    on(window, 'resize', debouncedHandler);

    return () => {
      off(window, 'resize', debouncedHandler);
    };
  }, [debouncedHandler]);

  return state;
};
