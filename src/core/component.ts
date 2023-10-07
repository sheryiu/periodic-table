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
    if (oldValue == newValue) return;
    inputSetterMap.get(this)?.[name]?.(newValue);
  }

  get cloneTemplate() {
    return this._template?.content?.cloneNode(true);
  }

  updateView() {

  }
}

const inputSetterMap = new WeakMap<Component, Record<string, (value: any) => void>>();

export function Definitions() {
  const observedAttributes = [] as string[];
  function DefineComponent<ComponentClassConstructor extends new (...args: any) => Component>(nodeName: string) {
    return function (baseClass: ComponentClassConstructor, context: ClassDecoratorContext<ComponentClassConstructor>) {
      Object.defineProperty(baseClass, 'observedAttributes', {
        get() { return observedAttributes },
        configurable: false,
        enumerable: false,
      });
      context.addInitializer(function () {
        window.customElements.define(nodeName, this);
      })
    }
  }
  function DefineInput<ComponentClass extends Component, ValueType>(
    transform: (val: string | null) => ValueType,
  ) {
    return function (value: ClassAccessorDecoratorTarget<ComponentClass, ValueType>, context: ClassAccessorDecoratorContext<ComponentClass>): ClassAccessorDecoratorResult<ComponentClass, ValueType> {
      if (typeof context.name === 'string') {
        const validAttributeName = context.name.toLowerCase();
        observedAttributes.push(validAttributeName);
        const { get, set } = value;
        context.addInitializer(function () {
          !inputSetterMap.has(this) && inputSetterMap.set(this, {});
          inputSetterMap.get(this)![validAttributeName] = (args: string) => {
            set.call(this, transform(args));
            this.updateView();
          }
        })
        return {
          set(val: any) {
            set.call(this, val);
            this.setAttribute(context.name as string, String(val));
            this.updateView();
          },
          get() {
            return get.call(this);
          },
          init(initialValue: ValueType) {
            setTimeout(() => {
              this.updateView();
            }, 0)
            return this.hasAttribute(context.name as string) ? transform(this.getAttribute(context.name as string)) : initialValue;
          }
        }
      }
      return value;
    }
  }
  return { DefineComponent, DefineInput };
}