import { ElectronModelComponent } from '../../components/electron-model/electron-model.component';
import { ElementCellComponent } from '../../components/element-cell/element-cell.component';
import { Component, Definitions } from '../../core';
import { ElementRef } from '../../core/decorators/component.decorator';
import { getElement, getElementCpkColor } from '../../shared/get-element';
import './element-page.component.css';

const { DefineComponent, DefineInput, DefineElementRef } = Definitions();

@DefineComponent('app-element-page')
export class ElementPage extends Component {

  @DefineInput(Number) accessor atomicNumber!: number;
  @DefineElementRef('app-element-cell') #elementCellRef!: ElementRef<ElementCellComponent>;
  @DefineElementRef('.element-page__header') #headerRef!: ElementRef<HTMLDivElement>;
  @DefineElementRef('.element-page__title') #titleRef!: ElementRef<HTMLHeadingElement>;
  @DefineElementRef('app-electron-model') #electronModelRef!: ElementRef<ElectronModelComponent>;

  constructor() {
    super([
      '<div class="element-page__wrapper">',
        '<header class="element-page__header">',
          '<div class="center-container">',
            '<app-element-cell displaySize="2.5"></app-element-cell>',
            '<h1 class="element-page__title"></h1>',
          '</div>',
        '</header>',
        '<section class="element-page__electron--wrapper">',
          '<div class="center-container">',
            '<h2>Electron Configuration</h2>',
            '<app-electron-model></app-electron-model>',
          '</div>',
        '</section>',
      '</div>'
    ]);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.updateView();
  }

  override updateView() {
    super.updateView();
    this.#elementCellRef.setAttribute('atomicNumber', this.atomicNumber);
    const element = getElement(this.atomicNumber);
    if (element) {
      this.#headerRef.setStyleProperty('element-color', getElementCpkColor(element));
      this.#headerRef.setStyleProperty('header-color', `#${ Math.floor(Math.random() * 255).toString(16).padStart(2, '0') }${ Math.floor(Math.random() * 255).toString(16).padStart(2, '0') }${ Math.floor(Math.random() * 255).toString(16).padStart(2, '0') }`);
      this.#titleRef.setText(element.name);
      this.#electronModelRef.setAttribute('electronConfiguration', element.electronicConfiguration);
    }
  }
}