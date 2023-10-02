import { Component, DefineComponent } from '../../core/component';
import './home.component.css';

@DefineComponent('app-home-page')
export class HomePage extends Component {

  constructor() {
    super(
      [
        '<div class="periodic-table-wrapper">',
          '<app-periodic-table></app-periodic-table>',
        '</div>'
      ]);
  }
}