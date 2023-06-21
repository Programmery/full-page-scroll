/* eslint-disable no-param-reassign */

import {RefObject} from 'react';
import {Callback, Coordinates} from '../types/common';
import {doNothing} from './funcs';

export function on<T extends Window | Document | HTMLElement | EventTarget>(
  obj: T | null,
  ...args:
    | Parameters<T['addEventListener']>
    | [
        string,
        // eslint-disable-next-line @typescript-eslint/ban-types
        Function | null,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...any
      ]
): void {
  if (obj && obj.addEventListener) {
    obj.addEventListener(
      ...(args as Parameters<HTMLElement['addEventListener']>),
    );
  }
}

export function off<T extends Window | Document | HTMLElement | EventTarget>(
  obj: T | null,
  ...args:
    | Parameters<T['removeEventListener']>
    | [
        string,

        // eslint-disable-next-line @typescript-eslint/ban-types
        Function | null,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...any
      ]
): void {
  if (obj && obj.removeEventListener) {
    obj.removeEventListener(
      ...(args as Parameters<HTMLElement['removeEventListener']>),
    );
  }
}

export const preventDefault = (event: Event) => {
  if (event.cancelable && event.preventDefault) {
    event.preventDefault();
  }
  // else {
  //   event.returnValue = false;
  // }
};

export const getPressedKey = (e: KeyboardEvent) => {
  if (e.key) {
    return e.key;
  }

  switch (e.keyCode) {
    case 38:
      return 'ArrowUp';
    case 40:
      return 'ArrowDown';
    case 37:
      return 'ArrowLeft';
    case 39:
      return 'ArrowRight';
    default:
      return 'unknown';
  }
};

export const isTouchDevice = !!navigator.userAgent.match(
  /(iPhone|iPod|iPad|Android|playbook|silk|BlackBerry|BB10|Windows Phone|Tizen|Bada|webOS|IEMobile|Opera Mini)/,
);

export const createTransformStyle = ({x = 0, y = 0}: Coordinates) =>
  typeof x === 'number' || typeof y === 'number'
    ? `translate3d(${x}px, ${y}px, 0px)`
    : undefined;

export const styleRefElement = <T extends HTMLElement>(
  ref: RefObject<T>,
  style: Partial<Pick<CSSStyleDeclaration, 'transform' | 'transition'>>,
) => {
  if (!ref.current) {
    return;
  }
  const {transform, transition} = style;
  if (transform) {
    ref.current.style.transform = transform;
  }
  if (transition) {
    ref.current.style.transition = transition;
  }
};

export const moveRefElement = <T extends HTMLElement>(
  ref: RefObject<T>,
  coordinates: Coordinates,
  transition: string | undefined = undefined,
) => {
  if (!ref.current) {
    return;
  }
  const {transform: prevTransform} = ref.current.style;

  const transform = createTransformStyle(coordinates);
  if (transform !== prevTransform) {
    styleRefElement(ref, {transform, transition});
  }
};

export const animateCss = (
  ref: RefObject<HTMLElement>,
  {
    animationDuration = isTouchDevice ? 400 : 600,
    coordinates = {x: 0, y: 0},
    // nonAnimatedStyles = {},
    removeTransitionOnFinish = false,

    onFinish = doNothing,
  }: {
    animationDuration?: number;
    coordinates?: Coordinates;
    // nonAnimatedStyles?: Partial<CSSStyleDeclaration>;
    onFinish?: Callback;
    removeTransitionOnFinish?: boolean;
  },
) => {
  if (!ref.current) {
    return;
  }
  const {
    transform: prevTransform,
    transition: prevTransition,
  } = ref.current.style;
  const finalStyles: Partial<
    Pick<CSSStyleDeclaration, 'transform' | 'transition'>
  > = {};
  let finalTransition = '';
  // const transition = `${animationDuration}ms cubic-bezier(0.4, 0, 0.22, 1)`;
  const transition = `${animationDuration}ms ease`;
  let appliedAnimationsCount = 0;
  if (coordinates) {
    finalStyles.transform = createTransformStyle(coordinates);
    if (prevTransform !== finalStyles.transform) {
      finalTransition += `${
        appliedAnimationsCount ? ', ' : ''
      }transform ${transition}`;

      appliedAnimationsCount += 1;
    }
  }
  if (!appliedAnimationsCount) {
    return;
  }
  finalStyles.transition = finalTransition;

  const applyStyles = () => {
    // TODO: uncomment for animation chaining
    // requestAnimationFrame(() => {
    //   requestAnimationFrame(() => {
    styleRefElement(ref, {...finalStyles});
    //   });
    // });
  };

  const onTransitionEnd = (ev: TransitionEvent) => {
    // Can do opacity later with ![op,tr].includes(ev.prName)
    if (ev.propertyName !== 'transform') {
      return;
    }
    appliedAnimationsCount -= 1;
    if (appliedAnimationsCount) {
      return;
    }
    if (ref.current) {
      ref.current.removeEventListener('transitionend', onTransitionEnd);
    }
    if (removeTransitionOnFinish) {
      styleRefElement(ref, {transition: prevTransition || 'none'});
    }
    onFinish();
  };
  ref.current.addEventListener('transitionend', onTransitionEnd);
  applyStyles();
};

export const getPageZoomLevel = (): number =>
  document.documentElement.clientWidth / window.innerWidth;

export const detectPageZoom = (): boolean => getPageZoomLevel() !== 1;
