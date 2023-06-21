import React, {FC, memo, ReactNode, useMemo} from 'react';
import {Stock} from '../../types/common';
import {createBlock} from '../../utils/bevis';
import {HorizontalTable} from '../HorizontalTable';
import {Table} from '../Table';
import checkIcon from '../../icons/check-green.svg';
import circleSprite from '../../icons/circle.sprite.svg';
import crossRed from '../../icons/cross-red.svg';

import './index.scss';
import {GenericSvg} from '../common/GenericSvg';

const {bl, el} = createBlock('stock-card');
interface Props {
  stock: Stock;
}

const orgs = ['zacks', 'yahoo', 'finviz'] as const;

const perfHeadCells = [
  {label: 'Year', dataKey: 'yearPerf'} as const,
  {label: 'Month', dataKey: 'monthPerf'} as const,
  {label: 'Week', dataKey: 'weekPerf'} as const,
];
const incomeHeadCells = [
  {label: 'Div', dataKey: 'dividend'} as const,
  {label: 'Payout', dataKey: 'payout'} as const,
  {label: 'Growth', dataKey: 'growth'} as const,
];

const detailsHeadCells = [
  {label: 'ROI', dataKey: 'roi'} as const,
  {label: 'LT Debt/Eq', dataKey: 'lTDebtEq'} as const,
  {label: 'ROE', dataKey: 'roe'} as const,
  {label: 'P/E', dataKey: 'pE'} as const,
  {label: 'P/FCF', dataKey: 'pFCF'} as const,
  {label: 'Profit M', dataKey: 'profitM'} as const,
  {label: 'Debt/Eq', dataKey: 'debtEq'} as const,
  {label: 'Forward P/E', dataKey: 'forwardPE'} as const,
  {label: 'Beta', dataKey: 'beta'} as const,
  // {label: 'Oper. Margin', dataKey: 'operMargin'} as const,
  {label: 'Market Cap', dataKey: 'marketCap' as const},
  {label: 'ROA', dataKey: 'roa'} as const,
];

const iconMap: Record<string, ReactNode> = {
  '1': <img src={checkIcon} alt="icon" />,
  '2': (
    <GenericSvg symbol={circleSprite} width={26} height={26} fill="#086218" />
  ),
  '3': (
    <GenericSvg symbol={circleSprite} width={26} height={26} fill="#EC9C01" />
  ),
  '4': (
    <GenericSvg symbol={circleSprite} width={26} height={26} fill="#800101" />
  ),
  '5': <img src={crossRed} alt="icon" />,
};

export const StockCard: FC<Props> = memo(({stock}) => {
  const {ticker, price, industry, company, recommends} = stock;

  const stockRows = useMemo(() => [stock], [stock]);
  const ratings = useMemo(
    () =>
      orgs
        .filter(o => {
          const r = recommends[o];
          const rateNum = (r && +r) || -1;
          return [1, 2, 3, 4, 5].includes(rateNum);
        })
        .map(org => {
          const rating = recommends[org];
          const icon = rating && iconMap[rating];
          return (
            <div key={org} className={el('recom')}>
              <div className={el('org')}>{org}</div>
              <div className={el('icon')}>{icon}</div>
            </div>
          );
        }),
    [recommends],
  );
  return (
    <div className={bl()}>
      <div className={el('content')}>
        <div className={el('header')}>
          <div className={el('ticker')}>
            [{ticker}]
            {price && (
              <>
                {`, `}
                <span className={el('price')}>${price}</span>
              </>
            )}
          </div>
          <div className={el('company')}>{company}</div>
        </div>

        <div className={el('industry')}>{industry}</div>
        <div className={el('tables')}>
          <div className={el('block')}>
            <div className={el('recommends')}>{ratings}</div>

            <div className={el('table', {div: true})}>
              <Table
                rowId="ticker"
                data={stockRows}
                headCells={incomeHeadCells}
              />
            </div>

            <div className={el('table', {period: true})}>
              <Table
                rowId="ticker"
                data={stockRows}
                headCells={perfHeadCells}
              />
            </div>
          </div>

          <div className={el('table', {details: true})}>
            <HorizontalTable data={stock} cells={detailsHeadCells} />
          </div>
        </div>
      </div>
    </div>
  );
});
