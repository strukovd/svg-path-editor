import { SimplePoint, Path, PathCommand } from "./svg";
import { optimizePath } from "./optimize-path";
import { getSubPathBounds } from "./get-sub-path-bounds";

const toStr = (pt: SimplePoint): [string, string] => {
  return [String(pt.x), String(pt.y)];
};


export const reversePath = (svg: Path, subpathOfItem?: number)=> {
  const {start, end} = getSubPathBounds(svg, subpathOfItem);

  if((end - start) <= 1) {
    return;
  }

  const isBeforeRelative = end < svg.d.length && svg.d[end].relative;
  if(isBeforeRelative) {
    svg.d[end].setRelative(false);
  }

  const subPath = svg.d.slice(start, end);
  const outputPath: PathCommand[] = [];
  const reversedPath = [...subPath].reverse().slice(0, -1);

  const startPoint = reversedPath[0].targetLocation();
  outputPath.push(PathCommand.Make(['M', ...toStr(startPoint)]));
  let previousType = '';
  let isClosed = false;

  for(const component of reversedPath) {
    const pt = toStr(component.previousPoint);
    const ctrl = component.absolutePoints.map(toStr);
    const type = component.getType(true);
    switch(type) {
      case 'M' :
      case 'Z' :
        if(isClosed) {
          outputPath.push(PathCommand.Make(['Z']));
        }
        isClosed = type === 'Z';
        if(outputPath[outputPath.length - 1].getType(true) === 'M') {
          outputPath[outputPath.length - 1] = PathCommand.Make(['M',  ...pt]);
        } else {
          outputPath.push(PathCommand.Make(['M',  ...pt]));
        }
        break;
      case 'L' :
        outputPath.push(PathCommand.Make(['L', ...pt]));
        break;
      case 'H' :
        outputPath.push(PathCommand.Make(['H', pt[0]]));
        break;
      case 'V' :
        outputPath.push(PathCommand.Make(['V', pt[1]]));
        break;
      case 'C' :
        outputPath.push(PathCommand.Make(['C', ...ctrl[1], ...ctrl[0], ...pt]));
        break;
      case 'S' : {
        const a = toStr(component.controlLocations()[0]);
        if(previousType !== 'S') {
          outputPath.push(PathCommand.Make(['C', ...ctrl[0], ...a, ...pt])); 
        } else {
          outputPath.push(PathCommand.Make(['S', ...a, ...pt]));
        }
        break;
      }
      case 'Q' :
        outputPath.push(PathCommand.Make(['Q', ...ctrl[0], ...pt]));
        break;
      case 'T' : {
        if(previousType !== 'T') {
          const a = toStr(component.controlLocations()[0]);
          outputPath.push(PathCommand.Make(['Q', ...a, ...pt]));
        } else {
          outputPath.push(PathCommand.Make(['T', ...pt]));
        }
        break;
      }
      case 'A' :
        outputPath.push(PathCommand.Make(['A', ...(component.values.slice(0, 4).map(String)), String(1-component.values[4]) , ...pt]));
        break;
    }
    previousType = type;
  }
  if(isClosed) {
    outputPath.push(PathCommand.Make(['Z']));
  }
  svg.d = [
    ...svg.d.slice(0, start),
    ...outputPath,
    ...svg.d.slice(end),
  ];
  svg.refreshAbsolutePositions();
  if(isBeforeRelative) {
    svg.d[start + outputPath.length].setRelative(true);
  }

  optimizePath(svg, {
    removeUselessCommands: true,
    useShorthands: true
  });
};