import "the-new-css-reset/css/reset.css";
import './style.css';
//
import { ElementCellComponent } from './components/element-cell/element-cell.component';
import { PeriodicTableComponent } from './components/periodic-table/periodic-table.component';
import { Router } from './core/router';
import { ElementPage } from './pages/element/element.component';
import { HomePage } from './pages/home/home.component';

export default {
  components: [
    HomePage,
    PeriodicTableComponent,
    ElementCellComponent,
    ElementPage,
  ],
  services: [
    Router.getRouter(),
  ]
};

