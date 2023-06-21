import React, {FC, memo, useMemo} from 'react';
import {InlineSvg} from '../../../types/common';
import {createBlock} from '../../../utils/bevis';
import {calcSvgSize, getViewBoxSize} from '../../../utils/other';

const {bl, el, mix} = createBlock('generic-svg');

interface Props {
  symbol: InlineSvg;
  className?: string;
  useClassName?: string;
  fill?: string;
  fillOpacity?: string;
  height?: number;
  width?: number;
  svgTop?: number;
  svgBottom?: number;
  svgLeft?: number;
  svgRight?: number;
}

export const GenericSvg: FC<Props> = memo(
  ({
    symbol,
    height,
    width,
    fill,
    fillOpacity,
    className,
    useClassName,
    svgTop = 0,
    svgBottom = 0,
    svgLeft = 0,
    svgRight = 0,
  }) => {
    const {
      size: {width: sWidth, height: sHeight},
      svgWidth,
      svgHeight,
      id,
      viewBox,
    } = useMemo(() => {
      const {id: sId, viewBox: viewBoxProps} = symbol;
      const {width: w, height: h} = getViewBoxSize(viewBoxProps);
      const vb = `0 0 ${w + svgLeft + svgRight} ${h + svgTop + svgBottom}`;
      const size = calcSvgSize({
        height,
        width,
        viewBox: vb,
      });
      return {
        size,
        svgWidth: w,
        svgHeight: h,
        id: sId,
        viewBox: vb,
      };
    }, [height, svgBottom, svgLeft, svgRight, svgTop, symbol, width]);

    return (
      <svg
        className={mix(bl(), className)}
        width={sWidth}
        height={sHeight}
        fill={fill}
        fillOpacity={fillOpacity}
        viewBox={viewBox}
      >
        <use
          className={mix(el('use'), useClassName)}
          x={svgLeft}
          y={svgTop}
          width={svgWidth}
          height={svgHeight}
          xlinkHref={`#${id}`}
        />
      </svg>
    );
  },
);
