import { Component, Definitions } from '../../core';
import './home-page.component.css';

const { DefineComponent } = Definitions();

@DefineComponent('app-home-page')
export class HomePage extends Component {

  constructor() {
    super([
      '<app-periodic-table></app-periodic-table>',
    ]);
  }
}