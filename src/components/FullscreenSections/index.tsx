import {observer} from 'mobx-react';
import React, {createRef, useMemo, useState} from 'react';
import {stocksStore} from '../../store/data/stocks';
import {SectionsData} from '../../types/common';
import {PageTitles} from '../../types/enums';
import {createBlock} from '../../utils/bevis';
import {Footer} from '../Footer';
import {Sections} from '../Sections';
import {SectionsControlsProvider} from '../SectionsControlsContext';
import {useFullscreenRefs} from './hooks/useFullscreenRefs';
import {useFullscreenScroll} from './hooks/useFullscreenScroll';

import './index.scss';

const sectionsInfo = [
  {title: PageTitles.Stocks, hideTitle: true, backgroundColor: '#EBEBEB'},
  {
    title: PageTitles.Pricing,
    description: 'Boost your income with our Premium Membership',
    backgroundColor: '#6BC3C3',
  },
  {
    title: PageTitles.About,
    backgroundColor: '#F5A25D',
  },
];

const {bl} = createBlock('fullscreen-sections');
export const FullscreenSections = observer(({sectionsData = sectionsInfo}) => {
  const [currSection, setCurrSection] = useState(0);
  // const [currHorizontalSection, setCurrHorizontalSection] = useState(0);
  const {containerRef} = useFullscreenRefs();
  const horizontalSectionsCount = stocksStore.stocksCount;
  const sections: SectionsData[] = useMemo(
    () =>
      sectionsData.map(
        ({title, description, hideTitle = false, backgroundColor}) => ({
          title,
          hideTitle,
          description,
          backgroundColor,
          ref: createRef<HTMLElement>(),
          ...(title === PageTitles.Stocks && {
            horizontalSectionsCount,
            swipeRef: createRef<HTMLDivElement>(),
          }),
        }),
      ),
    [sectionsData, horizontalSectionsCount],
  );
  const {goToSection, skipTo} = useFullscreenScroll({
    containerRef,
    sections,
    setCurrSection,
  });

  return (
    <>
      <main ref={containerRef} className={bl()}>
        <SectionsControlsProvider value={skipTo}>
          <Sections sections={sections} />
        </SectionsControlsProvider>
      </main>
      <Footer
        goToSection={goToSection}
        currSection={currSection}
        sections={sections}
      />
    </>
  );
});
