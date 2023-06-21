import React, {FC, memo} from 'react';
import {createBlock} from '../../utils/bevis';
import {Button} from '../common/Button';

import './index.scss';

const {bl, el} = createBlock('button-card');
interface Props {
  preTitle: string;
  title: string;
  subtitle: string;
  buttonTitle: string;
  className?: string;
}

export const ButtonCard: FC<Props> = memo(
  ({preTitle, title, subtitle, buttonTitle, className = ''}) => {
    return (
      <div className={bl(undefined, [className])}>
        <div className={el('content')}>
          <div className={el('texts')}>
            <div className={el('item', {preTitle: !!preTitle})}>{preTitle}</div>
            <div className={el('item', {title: !!title})}>{title}</div>
            <div className={el('item', {subtitle: !!subtitle})}>{subtitle}</div>
          </div>
        </div>
        <Button className={el('button')} title={buttonTitle} />
      </div>
    );
  },
);
