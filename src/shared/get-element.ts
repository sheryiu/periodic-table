import data from './data.json';

export function getElement(atomicNumber: number): (typeof data)[number] | undefined {
  return data.find((el) => el.atomicNumber === atomicNumber);
}

export function getElementPeriod(atomicNumber: number): number {
  const periods = [2, 8, 8, 18, 18, 32, 32];
  let period = 1;
  while (period < periods.length + 1) {
    atomicNumber -= periods[period - 1];
    if (atomicNumber <= 0) {
      // if (period === 6 && (atomicNumber + 32 >= 4 && atomicNumber + 32 < 18)) return period + 2;
      // if (period === 7 && (atomicNumber + 32 >= 4 && atomicNumber + 32 < 18)) return period + 2;
      return period;
    }
    period++;
  }
  return period;
}

// 1 - 32
export function getElementGroup(atomicNumber: number) {
  const periods = [2, 8, 8, 18, 18, 32, 32];
  const elOnLeftSide = [1, 2, 2, 3, 3, 32, 32];
  const period = getElementPeriod(atomicNumber);
  const numberInPeriod = atomicNumber - periods.slice(0, period - 1).reduce((sum, count) => sum + count, 0);
  if (numberInPeriod <= elOnLeftSide[period - 1]) return numberInPeriod;
  else return numberInPeriod + 32 - periods[period - 1];
}

export function getElementCpkColor(element: (typeof data)[number]): string;
export function getElementCpkColor(atomicNumber: number): string;
export function getElementCpkColor(_element: number | (typeof data)[number]) {
  const element = (typeof _element === 'number') ? getElement(_element) : _element;
  if (element) {
    return '#' + (typeof element.cpkHexColor === 'number' ? String(element.cpkHexColor).padStart(6, '0') : element.cpkHexColor.padStart(6, '0'))
  } else {
    return '#000000';
  }
}