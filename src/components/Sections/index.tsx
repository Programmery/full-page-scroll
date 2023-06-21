import {observer} from 'mobx-react';
import React, {FC} from 'react';
import {useMount} from 'react-use';
import {stocksStore} from '../../store/data/stocks';
import {SectionsData} from '../../types/common';
import {createBlock} from '../../utils/bevis';
import {SectionContent} from '../SectionsContent/SectionContent';

import './index.scss';

interface Props {
  sections: SectionsData[];
}

const {bl, el} = createBlock('section');

export const Sections: FC<Props> = observer(({sections}) => {
  useMount(() => {
    stocksStore.fetchOne();
  });
  return (
    <>
      {sections.map(
        (
          {
            title,
            hideTitle = false,
            description,
            backgroundColor,
            swipeRef,
            horizontalSectionsCount,
          },
          i,
        ) => (
          <section
            ref={sections[i].ref}
            key={title}
            className={bl({fullWidth: !!horizontalSectionsCount})}
            style={{backgroundColor, top: `${100 * i}%`}}
          >
            <div className={el('content-container', {fullHeight: !!swipeRef})}>
              {!hideTitle && <h1 className={el('title')}>{title}</h1>}
              {description && (
                <div className={el('description')}>{description}</div>
              )}

              <SectionContent
                className={el('section-content')}
                title={title}
                swipeRef={swipeRef}
              />
            </div>
          </section>
        ),
      )}
    </>
  );
});
