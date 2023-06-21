export const calcSvgSize = ({
  width,
  height,
  viewBox,
}: {
  width?: number;
  height?: number;
  viewBox: string;
}): {width: number; height: number} => {
  if (typeof width === 'number' && typeof height === 'number') {
    return {width, height};
  }
  const {width: svgWidth, height: svgHeight} = getViewBoxSize(viewBox);
  const ratio = svgWidth / svgHeight;

  if (typeof width === 'number') {
    return {width, height: width / ratio};
  }
  if (typeof height === 'number') {
    return {width: height * ratio, height};
  }
  return {width: svgWidth, height: svgHeight};
};

export const getViewBoxSize = (viewBox: string) => {
  const [, , width, height] = viewBox.split(/\s+/).map(v => parseFloat(v) || 1);
  return {width, height};
};
