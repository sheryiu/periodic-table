import "the-new-css-reset/css/reset.css";
import './style.css';
//
import { ElectronModelComponent } from './components/electron-model/electron-model.component';
import { ElementCellComponent } from './components/element-cell/element-cell.component';
import { PeriodicTableComponent } from './components/periodic-table/periodic-table.component';
import { Router } from './core/router';
import { ElementPage } from './pages/element/element-page.component';
import { HomePage } from './pages/home/home-page.component';

export default {
  components: [
    HomePage,
    PeriodicTableComponent,
    ElementCellComponent,
    ElementPage,
    ElectronModelComponent,
  ],
  services: [
    Router.getRouter(),
  ]
};

