import { Component, Definitions } from '../../core';
import { ElementRef } from '../../core/decorators/component.decorator';
import './electron-model.component.css';

const { DefineComponent, DefineElementRef, DefineInput } = Definitions();

@DefineComponent('app-electron-model')
export class ElectronModelComponent extends Component {

  @DefineInput(String) accessor electronConfiguration!: string;
  @DefineElementRef('.electron-model__wrapper') #headerRef!: ElementRef<HTMLDivElement>;

  constructor() {
    super([
      '<div class="electron-model__wrapper">',
      '</div>'
    ])
  }

  override updateView(): void {
    super.updateView();
    console.log('update', this.electronConfiguration, this.#headerRef.nativeElement?.deref())
    this.#headerRef.setText(this.electronConfiguration)
  }
}