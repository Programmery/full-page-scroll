import {RefObject} from 'react';
import {PageTitles} from './enums';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Func<ReturnType extends any = void> = () => ReturnType;
export type TimeoutTimerId = ReturnType<typeof setTimeout>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Callback<T extends any = void> = T extends void
  ? () => void
  : (arg: T) => void;

export type DivRef = RefObject<HTMLDivElement>;

export interface PointerData {
  clientY: number;
  clientX: number;
  startY: number;
  startX: number;
  deltaY: number;
  deltaX: number;
}

export interface Coordinates {
  x?: number;
  y?: number;
}

export interface ServerStock {
  Ticker: string;
  Beta?: string;
  Company?: string;
  Country?: string;
  'Curr R'?: string;
  'Growth'?: string;
  'Debt/Eq'?: string;
  Dividend?: string;
  'Fwd P/E'?: string;
  Industry?: string;
  'LTDebt/Eq'?: string;
  'Market Cap'?: string;
  'No.'?: string;
  'Oper M'?: string;
  Outstanding?: string;
  'P/E'?: string;
  'P/FCF'?: string;
  'Payout Ratio'?: string;
  'Perf Month'?: string;
  'Perf Week'?: string;
  'Perf YTD'?: string;
  Price?: string;
  'Profit M'?: string;
  'Quick R'?: string;
  ROA?: string;
  ROE?: string;
  ROI?: string;
  Recom?: string;
  'Recom Yahoo'?: string;
  'Recom Zacks'?: string;
  Sector?: string;
}

export interface InlineSvg {
  content: string;
  id: string;
  viewBox: string;
}

export interface Stock {
  ticker: string;
  // beta?: string;
  company?: string;
  // Country?: string;
  // 'Curr R'?: string;
  // 'Debt/Eq'?: string;
  dividend?: string;
  // 'Fwd P/E'?: string;
  industry?: string;
  growth?: string;
  // 'LTDebt/Eq'?: string;
  marketCap?: string;
  // 'No.'?: string;
  // 'Oper M'?: string;
  // Outstanding?: string;
  payout?: string;
  monthPerf?: string;
  weekPerf?: string;
  yearPerf?: string;
  price?: string;
  profitM?: string;
  // 'Quick R'?: string;
  roa?: string;
  roe?: string;
  roi?: string;

  forwardPE?: string;
  pE?: string;
  pFCF?: string;
  beta?: string;
  debtEq?: string;
  lTDebtEq?: string;
  operMargin?: string;
  recommends: {zacks?: string; yahoo?: string; finviz?: string};

  // Sector?: string;
}

export interface SectionsData {
  swipeRef?: DivRef;
  description?: string;
  title: PageTitles;
  hideTitle?: boolean;
  backgroundColor: string;
  ref: RefObject<HTMLElement>;
  horizontalSectionsCount?: number;
}

/**
 * Construct a union string type with keys of `Object`
 * where the value type is `ValueType`
 *
 * @example
 *
 * interface A {
 *   id: number,
 *   name: string,
 *   surname: string,
 *   gender: 'male' | 'female'
 *   deleted: boolean,
 *   optional?: any[]
 * }
 *
 * let stringKey: TKeysByValueType<A, string>;
 * // Result union type: 'name' | 'surname'
 *
 * let booleanKey: TKeysByValueType<A, boolean>;
 * // Result type: 'deleted'
 *
 * let stringOrNumberKey: TKeysByValueType<A, string | number>;
 * // Result union type: 'id' | 'name' | 'surname'
 *
 * let wrongSpecificKey: TKeysByValueType<A, 'male'>;
 * // Result type will be never
 * let specificKey: TKeysByValueType<A, 'male' | 'female'>;
 * // Result type: 'gender'
 * specificKey = 'gender' // ok
 * specificKey = 'anythingElse' // error: Type '"anythingElse"' is not assignable to type '"gender"'
 *
 * let wrongOptional: TKeysByValueType<A, any[]>;
 * // Result type will be never
 * let optional: TKeysByValueType<A, any[] | undefined>;
 * // Result type: "optional" | undefined
 *
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TKeysByValueType<T extends Record<string, any>, V> = {
  [K in keyof T]: T[K] extends V ? (K extends string ? K : never) : never;
}[keyof T];
