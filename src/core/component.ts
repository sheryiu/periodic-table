export abstract class Component extends HTMLElement {

  private _templateString: string;
  private _template?: HTMLTemplateElement;

  constructor(
    templateString: string | Array<string>,
  ) {
    super();
    if (Array.isArray(templateString)) this._templateString = templateString.join('\n');
    else this._templateString = templateString;
  }

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
    console.log(name)
  }

  get cloneTemplate() {
    return this._template?.content?.cloneNode(true);
  }
}

export function DefineComponent<T extends new (...args: any) => HTMLElement>(name: string) {
  return function (baseClass: T, context: ClassDecoratorContext<T>) {
    window.customElements.define(name, baseClass);
  }
}