import { Path } from "./svg";

const findPreviousMoveTo = (svg: Path, index: number) => {
  let i = index;
  while (i > 0 && svg.d[i].getType(true) !== 'M') {
    i--;
  }
  return i;
};
const findNextMoveTo = (svg: Path, index: number) => {
  let i = index + 1;
  while (i < svg.d.length && svg.d[i].getType(true) !== 'M') {
    i++;
  }
  return i;
};
export const getSubPathBounds = (svg: Path, index?: number) => {
  const start = index === undefined ? 0 : findPreviousMoveTo(svg, index);
  const end = index === undefined ? svg.d.length : findNextMoveTo(svg, index);
  return { start, end };
};
