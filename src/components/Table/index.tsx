/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {memo} from 'react';
import {TKeysByValueType} from '../../types/common';
import {createBlock} from '../../utils/bevis';

import './index.scss';

const {bl} = createBlock('table');
interface Props<T extends Record<string, any>> {
  data: T[];
  rowId: TKeysByValueType<T, string>;
  headCells: Array<{label: string; dataKey: keyof T & string}>;
}

export const Table = memo(
  <T extends Record<string, any>>({rowId, data, headCells}: Props<T>) => {
    return (
      <table className={bl()}>
        <thead>
          <tr>
            {headCells.map(({label}) => (
              <th key={label}>{label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, i) => {
            const key = item[rowId] || `${i}`;
            return (
              <tr key={key}>
                {headCells.map(({dataKey}) => (
                  <td key={`${dataKey}`}>{item[dataKey] || '—'}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  },
);
