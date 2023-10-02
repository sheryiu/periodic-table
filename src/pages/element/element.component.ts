import { ElementCellComponent } from '../../components/element-cell/element-cell.component';
import { Component, DefineComponent } from '../../core/component';
import './element.component.css';

@DefineComponent('app-element-page')
export class ElementPage extends Component {

  private _atomicNumber: number = Number(this.getAttribute('atomicNumber'));
  get atomicNumber(): number {
    return this._atomicNumber;
  }
  set atomicNumber(val: number | string) {
    if (val != null) {
      this.setAttribute('atomicNumber', String(val));
      this._atomicNumber = Number(val);
    }
    this.updateView();
  }

  constructor() {
    super(
      [
        '<div>',
        '<app-element-cell displaySize="2.5"></app-element-cell>',
        '</div>'
      ]);
  }

  private _elementCellEl!: ElementCellComponent;

  override connectedCallback(): void {
    super.connectedCallback();
    this._elementCellEl = this.querySelector('app-element-cell') as ElementCellComponent;
    this.updateView();
  }

  private updateView() {
    this._elementCellEl.atomicNumber = this.atomicNumber;
  }
}