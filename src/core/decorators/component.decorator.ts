import { Component } from '../component';

/** @private */
export const inputSetterMap = new WeakMap<Component, Record<string, (value: any) => void>>();
/** @private */
export const elementRefMap = new WeakMap<Component, Set<ElementRef>>();

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
  function DefineElementRef<ComponentClass extends Component, T extends HTMLElement>(
    selector: string,
  ) {
    try {
      const tempEl = document.createElement('div');
      tempEl.querySelector(selector);
      tempEl.remove();
    } catch (error: any) {
      console.log(error)
      throw new Error(`Invalid Query Selector: ${ selector }`);
    }
    return function (_: undefined, context: ClassFieldDecoratorContext<ComponentClass>) {
      return function (this: any, initialValue: ElementRef<T>): ElementRef<T> {
        !elementRefMap.has(this) && elementRefMap.set(this, new Set());
        const elRef = new ElementRef<T>(selector);
        elementRefMap.get(this)!.add(elRef);
        return elRef;
      }
    }
  }
  return { DefineComponent, DefineInput, DefineElementRef };
}

export class ElementRef<Type extends HTMLElement = HTMLElement> {
  nativeElement!: WeakRef<Type> | undefined;

  constructor(readonly selector: string) {

  }

  setAttribute(attrName: string, value: number | null): void;
  setAttribute(attrName: string, value: string | null): void;
  setAttribute(attrName: string, value: string | number | null) {
    if (value != null) {
      this.nativeElement?.deref()?.setAttribute(attrName, (
        typeof value === 'string' ? value : String(value)
      ));
    } else {
      this.nativeElement?.deref()?.removeAttribute(attrName);
    }
  }

  setStyleProperty(propertyName: string | `--${ string }`, value: string | null) {
    const validPropertyName = propertyName.startsWith('--') ? propertyName : ('--'+propertyName);
    if (value != null) {
      this.nativeElement?.deref()?.style.setProperty(validPropertyName, value);
    } else {
      this.nativeElement?.deref()?.style.removeProperty(validPropertyName);
    }
  }

  setText(value: string | null | undefined) {
    const temp = this.nativeElement?.deref();
    if (temp) {
      temp.innerText = value ?? '';
    }
  }
}