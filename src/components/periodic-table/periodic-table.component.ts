import { Component, DefineComponent } from '../../core/component';
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
    this.querySelectorAll('app-element-cell').forEach(cell => {
      cell.addEventListener('click', () => {
        this.router.navigateTo(['element', (cell as ElementCellComponent).atomicNumber]);
      })
    })
  }
}