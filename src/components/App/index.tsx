import React, {FC} from 'react';
import {createBlock} from '../../utils/bevis';
import {FullscreenSections} from '../FullscreenSections';

import './index.scss';

const {bl, el} = createBlock('app');

export const App: FC = () => {
  return (
    <div className={bl()}>
      <header className={el('header')}>
        <h1 className={el('website-title')}>stocker</h1>
      </header>
      <FullscreenSections />
    </div>
  );
};

export default App;
