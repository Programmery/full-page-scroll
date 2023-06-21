import {observer} from 'mobx-react';
import React, {FC, useCallback, useContext} from 'react';
import {useMountedState} from 'react-use';
import {stocksStore} from '../../store/data/stocks';
import {SectionsData} from '../../types/common';
import {PageTitles} from '../../types/enums';
import {createBlock} from '../../utils/bevis';
import {wait} from '../../utils/funcs';
import {ButtonCard} from '../ButtonCard';
import {Button} from '../common/Button';
import {SectionsControlsContext} from '../SectionsControlsContext';
import {StockCard} from '../StockCard';

import './index.scss';

interface Props {
  className?: string;
  title: PageTitles;
  swipeRef: SectionsData['swipeRef'];
}
const btl = 'Join now';

const pricingCards = [
  {
    preTitle: 'Friend',
    title: '2.99$',
    subtitle: '1 month',
    buttonTitle: btl,
  },
  {
    preTitle: 'Best friend',
    title: '14.99$',
    subtitle: '6 month',
    buttonTitle: btl,
  },
  {
    preTitle: 'Bro',
    title: '24.99$',
    subtitle: '1 year',
    buttonTitle: btl,
  },
];

const {bl, el} = createBlock('section-content');
export const SectionContent: FC<Props> = observer(
  ({title: sectionTitle, className = '', swipeRef}) => {
    const skipToSection = useContext(SectionsControlsContext);
    const isMounted = useMountedState();
    const handleGetStock = useCallback(() => {
      stocksStore.fetchOne({
        onSuccess: () =>
          wait(100).then(() => isMounted() && skipToSection('end', true)),
      });
    }, [skipToSection, isMounted]);
    return (
      <div className={bl({horizontalScroll: !!swipeRef}, [className])}>
        {sectionTitle === PageTitles.Stocks && (
          <div className={el('content-wrapper')}>
            <div className={el('scrolled-section-viewport')}>
              <div ref={swipeRef} className={el('scrolled-section')}>
                {stocksStore.stocks.map((stock) => (
                  <div className={el('card-container')} key={stock.ticker}>
                    <StockCard stock={stock} />
                  </div>
                ))}
              </div>
            </div>
            <div className={el('mr-pusher')} />
            {/* TODO: LOADER if first stock is fetching */}
            {!!stocksStore.stocks.length && (
              <Button
                className={el('next-btn')}
                title="NEXT STOCK"
                size="l"
                onClick={handleGetStock}
              />
            )}
          </div>
        )}
        {sectionTitle === PageTitles.Pricing && (
          <div className={el('button-cards')}>
            {pricingCards.map(({preTitle, title, subtitle, buttonTitle}) => (
              <ButtonCard
                key={title}
                className={el('button-card')}
                preTitle={preTitle}
                title={title}
                subtitle={subtitle}
                buttonTitle={buttonTitle}
              />
            ))}
          </div>
        )}
      </div>
    );
  },
);
