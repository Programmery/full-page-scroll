/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {memo} from 'react';
import {createBlock} from '../../utils/bevis';

import './index.scss';

const {bl} = createBlock('horizontal-table');
interface Props<T extends Record<string, any>> {
  data: T;
  cells: Array<{label: string; dataKey: keyof T}>;
}

export const HorizontalTable = memo(
  <T extends Record<string, any>>({data, cells}: Props<T>) => (
    <table className={bl()}>
      <tbody>
        {cells.map(({label, dataKey}) => (
          <tr key={label}>
            <td>{label}</td>
            <td>{data[dataKey] || '—'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  ),
);
