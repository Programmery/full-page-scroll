import {createContext} from 'react';
import {doNothing} from '../../utils/funcs';
import {SkipToSectionFunc} from '../FullscreenSections/hooks/types';

export const SectionsControlsContext = createContext<SkipToSectionFunc>(
  doNothing,
);

export const SectionsControlsProvider = SectionsControlsContext.Provider;
export const SectionsControlsConsumer = SectionsControlsContext.Consumer;
