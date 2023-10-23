import { Component, Definitions } from '../../core';
import data from '../../shared/data.json';
import { getElementCpkColor } from '../../shared/get-element';
import './element-cell.component.css';

const { DefineComponent, DefineInput } = Definitions();

@DefineComponent('app-element-cell')
export class ElementCellComponent extends Component {
  constructor() {
    super([
      '<div class="element-cell__face">',
        `<span class="element-cell__title"></span>`,
        `<span class="element-cell__number"></span>`,
      '</div>',
      '<div class="element-cell__face--wrapper">',
        '<div class="element-cell__face--behind" data-pos="left"></div>',
        '<div class="element-cell__face--behind" data-pos="right"></div>',
        '<div class="element-cell__face--behind" data-pos="top"></div>',
        '<div class="element-cell__face--behind" data-pos="bottom"></div>',
        '<div class="element-cell__face--behind" data-pos="back"></div>',
      '</div>'
    ]);
  }

  @DefineInput(Number) accessor atomicNumber!: number;
  @DefineInput(Number) accessor displaySize: number = 1;

  private _titleEl!: HTMLElement;
  private _numberEl!: HTMLElement;

  override connectedCallback(): void {
    super.connectedCallback();
    this._titleEl = this.querySelector('.element-cell__title')!;
    this._numberEl = this.querySelector('.element-cell__number')!;
    this.updateView();
    setTimeout(() => {
      this.style.setProperty('--self-x', this.getBoundingClientRect().x + 'px');
      this.style.setProperty('--self-y', this.getBoundingClientRect().y + 'px');
    })
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
  }

  override updateView() {
    super.updateView();
    const element = data.find((el) => el.atomicNumber === this.atomicNumber);
    if (element && this._titleEl && this._numberEl) {
      this._titleEl.innerHTML = element.symbol;
      this._numberEl.innerText = String(element.atomicNumber);
      this.style.setProperty('--element-name', element.name);
      this.style.setProperty(
        '--element-color',
        getElementCpkColor(element)
      );
      this.style.setProperty('--size', `${this.displaySize}rem`);
    }
  }
}