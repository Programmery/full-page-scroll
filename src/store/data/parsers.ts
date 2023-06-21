import {ServerStock, Stock} from '../../types/common';

const parseValue = (value: string | undefined) =>
  !value || value === '-' ? undefined : value;

const getValues = <
  O extends Partial<Record<T, string | undefined>>,
  T extends keyof O
>(
  keys: T[],
  obj: O,
) =>
  keys.reduce((acc, key) => {
    const value = parseValue(obj[key]);
    // eslint-disable-next-line no-param-reassign
    acc[key] = value;
    return acc;
  }, {} as Record<T, string | undefined>);

export const parseStocks = (stocks: Array<ServerStock>): Stock[] =>
  stocks.filter(Boolean).map(serverStock => {
    const {Ticker: ticker} = serverStock;
    const {
      Industry: industry,
      Price: price,
      Recom: finviz,
      Company: company,
      Dividend: dividend,
      'Payout Ratio': payout,
      'Perf Month': monthPerf,
      'Perf Week': weekPerf,
      'Perf YTD': yearPerf,
      'Fwd P/E': forwardPE,
      'P/E': pE,
      'P/FCF': pFCF,
      Beta: beta,
      'Debt/Eq': debtEq,
      'LTDebt/Eq': lTDebtEq,
      'Oper M': operMargin,
      ROI: roi,
      ROA: roa,
      ROE: roe,
      'Market Cap': marketCap,
      'Profit M': profitM,
      Growth: growth,
    } = getValues(
      [
        'Company',
        'Industry',
        'Price',
        'Recom',
        'Dividend',
        'Payout Ratio',
        'Perf Month',
        'Perf Week',
        'Perf YTD',
        'Fwd P/E',
        'P/E',
        'P/FCF',
        'Beta',
        'Debt/Eq',
        'LTDebt/Eq',
        'Oper M',
        'ROI',
        'ROE',
        'ROA',
        'Market Cap',
        'Growth',
        'Profit M',
      ],
      serverStock,
    );
    const yahoo = parseValue(serverStock['Recom Yahoo']);
    const zacks = parseValue(serverStock['Recom Zacks']);
    return {
      company,
      ticker,
      price,
      industry,
      dividend,
      payout,
      weekPerf,
      monthPerf,
      yearPerf,
      forwardPE,
      pE,
      pFCF,
      beta,
      debtEq,
      lTDebtEq,
      operMargin,
      recommends: {yahoo, zacks, finviz},
      roi,
      roa,
      roe,
      marketCap,
      profitM,
      growth,
    };
  });
