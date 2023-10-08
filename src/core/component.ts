import { AddComponentClass } from './decorators/add-component-class.decorator';
import { elementRefMap, inputSetterMap } from './decorators/component.decorator';

export abstract class Component extends HTMLElement {

  private _templateString: string;

  constructor(
    templateString: string | Array<string>,
  ) {
    super();
    if (Array.isArray(templateString)) this._templateString = templateString.join('\n');
    else this._templateString = templateString;
  }

  @AddComponentClass
  connectedCallback() {
    const template = document.createElement('template');
    template.innerHTML = this._templateString;
    this.appendChild(template.content.cloneNode(true))
  }

  disconnectedCallback() {

  }

  adoptedCallback() {

  }

  attributeChangedCallback(name: string, oldValue: unknown, newValue: unknown) {
    if (oldValue == newValue) return;
    inputSetterMap.get(this)?.[name]?.(newValue);
  }

  updateView() {
    const map = elementRefMap.get(this);
    map?.forEach(elementRef => {
      const native = this.querySelector(elementRef.selector);
      if (native instanceof HTMLElement) {
        if (elementRef.nativeElement?.deref() === native) return;
        elementRef.nativeElement = new WeakRef(native);
      } else {
        elementRef.nativeElement = undefined;
      }
    })
  }
}