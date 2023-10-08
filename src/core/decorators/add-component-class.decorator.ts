import { Component } from '../component';

/** @private */
export function AddComponentClass<T extends Component>(originalMethod: (...args: any) => any, context: ClassMethodDecoratorContext<T>) {
  context.addInitializer(function () {
    this.classList.add(this.nodeName.toLowerCase());
  })
  return originalMethod;
}
