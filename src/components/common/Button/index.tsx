import React, {FC, memo} from 'react';
import {Func} from '../../../types/common';
import {createBlock} from '../../../utils/bevis';
import {isTouchDevice} from '../../../utils/browser-utils';

import './index.scss';

const {bl, el} = createBlock('button');

interface ButtonProps {
  title?: string;
  onClick?: Func;
  className?: string;
  size?: 'm' | 'l';
}

export const Button: FC<ButtonProps> = memo(
  ({title, onClick, size = 'm', className = ''}) => {
    return (
      <button
        type="button"
        onClick={onClick}
        className={bl({isTouch: isTouchDevice, size}, [className])}
      >
        <div className={el('title')}>{title}</div>
      </button>
    );
  },
);
