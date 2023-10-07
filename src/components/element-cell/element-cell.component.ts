import { Component, Definitions } from '../../core/component';
import data from '../../shared/data.json';
import './element-cell.component.css';

const { DefineComponent, DefineInput } = Definitions();

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

  @DefineInput(Number) accessor atomicNumber!: number;
  @DefineInput(Number) accessor displaySize: number = 1;

  private _titleEl!: HTMLElement;
  private _numberEl!: HTMLElement;

  override connectedCallback(): void {
    super.connectedCallback();
    this.classList.add('app-element-cell');
    this._titleEl = this.querySelector('.element-cell__title')!;
    this._numberEl = this.querySelector('.element-cell__number')!;
    this.updateView();
  }

  override updateView() {
    const element = data.find((el) => el.atomicNumber === this.atomicNumber);
    if (element && this._titleEl && this._numberEl) {
      this._titleEl.innerHTML = element.symbol;
      this._numberEl.innerText = String(element.atomicNumber);
      this.style.setProperty('--element-name', element.name);
      this.style.setProperty(
        '--element-color',
        '#' + (typeof element.cpkHexColor === 'number' ? String(element.cpkHexColor).padStart(6, '0') : element.cpkHexColor.padStart(6, '0'))
      );
      this.style.setProperty('--size', `${this.displaySize}rem`);
    }
  }
}