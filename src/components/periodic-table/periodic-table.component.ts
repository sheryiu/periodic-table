import { Component, Definitions } from '../../core/component';
import { Router } from '../../core/router';
import data from '../../shared/data.json';
import { ElementCellComponent } from '../element-cell/element-cell.component';
import './periodic-table.component.css';

interface ElementData {
  atomicNumber: number;
  symbol: string;
  name: string;
  atomicMass: string;
  cpkHexColor: string;
  electronicConfiguration: string;
  electronegativity: number;
  atomicRadius: number;
  ionRadius: string;
  vanDelWaalsRadius: number;
  ionizationEnergy: number;
  electronAffinity: number;
  oxidationStates: string;
  standardState: string;
  bondingType: string;
  meltingPoint: number;
  boilingPoint: number;
  density: number;
  groupBlock: string;
  yearDiscovered: number;
}

const { DefineComponent } = Definitions();

@DefineComponent('app-periodic-table')
export class PeriodicTableComponent extends Component {

  private router = Router.getRouter();

  constructor() {
    super(
      [
        '<div class="periodic-table">',
        ...data.map(el => el.atomicNumber).map(num => `<app-element-cell atomicNumber="${ num }"></app-element-cell>`),
        '</div>'
      ]);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.querySelectorAll('app-element-cell').forEach((cell, i) => {
      cell.addEventListener('click', () => {
        this.router.navigateTo(['element', (cell as ElementCellComponent).atomicNumber]);
      });
      (cell as HTMLElement).style.setProperty('--element-period', String(getPeriod(i + 1)));
      (cell as HTMLElement).style.setProperty('--element-group', String(getGroup(i + 1)));
    })
  }
}

function getPeriod(atomicNumber: number): number {
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
function getGroup(atomicNumber: number) {
  const periods = [2, 8, 8, 18, 18, 32, 32];
  const elOnLeftSide = [1, 2, 2, 3, 3, 32, 32];
  const period = getPeriod(atomicNumber);
  const numberInPeriod = atomicNumber - periods.slice(0, period - 1).reduce((sum, count) => sum + count, 0);
  if (numberInPeriod <= elOnLeftSide[period - 1]) return numberInPeriod;
  else return numberInPeriod + 32 - periods[period - 1];
}
