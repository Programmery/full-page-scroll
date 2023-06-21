import React, {FC, memo} from 'react';
import {Callback, SectionsData} from '../../types/common';
import {createBlock} from '../../utils/bevis';
import {isTouchDevice} from '../../utils/browser-utils';

import './index.scss';

interface Props {
  sections: SectionsData[];
  currSection: number;
  goToSection: Callback<number>;
}

const {bl, el} = createBlock('footer');
export const Footer: FC<Props> = memo(
  ({sections, currSection, goToSection}) => {
    return (
      <footer className={bl({isTouch: isTouchDevice})}>
        <nav className={el('menu')}>
          {sections.map(({title}, i) => (
            <li
              // TODO: check layer
              aria-hidden="true"
              onClick={() => {
                goToSection(i);
              }}
              className={el('item', {isActive: currSection === i})}
              key={title}
            >
              <div className={el('text')}>{title}</div>
            </li>
          ))}
        </nav>
      </footer>
    );
  },
);
