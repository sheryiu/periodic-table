import { Component, DefineComponent } from '../../core/component';
import { Router } from '../../core/router';
import data from '../../shared/data.json';
import './element-cell.component.css';

@DefineComponent('app-element-cell')
export class ElementCellComponent extends Component {
  constructor() {
    super([
      '<div class="element-cell__face">',
      `<span class="element-cell__title"></span>`,
      `<span class="element-cell__number"></span>`,
      '</div>'
    ]);
  }

  private _atomicNumber: number = Number(this.getAttribute('atomicNumber'));
  get atomicNumber(): number {
    return this._atomicNumber;
  }
  set atomicNumber(val: number | string) {
    if (val != null) {
      this._atomicNumber = Number(val);
      this.setAttribute('atomicNumber', String(this._atomicNumber));
      this.updateView();
    }
  }

  private _displaySize: number = isNaN(Number(this.getAttribute('displaySize'))) ? 1 : Math.max(Number(this.getAttribute('displaySize')), 1);
  get displaySize(): number {
    return this._displaySize;
  }
  set displaySize(val: number | string) {
    if (val != null) {
      this._displaySize = isNaN(Number(val)) ? 1 : Math.max(Number(val), 1);
      this.setAttribute('displaySize', String(this._displaySize));
      this.updateView();
    }
  }

  static observedAttributes = ['atomicNumber', 'displaySize'];

  private _titleEl!: HTMLElement;
  private _numberEl!: HTMLElement;

  override connectedCallback(): void {
    super.connectedCallback();
    this.classList.add('app-element-cell');
    this._titleEl = this.querySelector('.element-cell__title')!;
    this._numberEl = this.querySelector('.element-cell__number')!;
    this.updateView();
  }

  override attributeChangedCallback(name: string, oldValue: unknown, newValue: unknown): void {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (name === 'atomicNumber') {
      this.atomicNumber = newValue as string;
    } else if (name === 'displaySize') {
      this.displaySize = newValue as string;
    }
  }

  private updateView() {
    const element = data.find((el) => el.atomicNumber === this.atomicNumber);
    if (element) {
      this._titleEl.innerText = element.symbol;
      this._numberEl.innerText = String(element.atomicNumber);
      this.style.setProperty('--element-name', element.name);
      this.style.setProperty('--element-period', String(getPeriod(element.atomicNumber)));
      this.style.setProperty('--element-group', String(getGroup(element.atomicNumber)));
      this.style.setProperty(
        '--element-color',
        '#' + (typeof element.cpkHexColor === 'number' ? String(element.cpkHexColor).padStart(6, '0') : element.cpkHexColor.padStart(6, '0'))
      );
      this.style.setProperty('--size', `${this.displaySize}rem`);
    }
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
