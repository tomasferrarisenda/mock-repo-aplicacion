/**
* @author: pferrer
* @description: Listado de grupos de prestaciones medicas
* @type: Component
**/
import * as angular from 'angular';
import { GrupoPrestacionMedicaListController } from './GrupoPrestacionMedicaListController';
const GrupoPrestacionMedicaListTemplate = require('./GrupoPrestacionMedicaListComponent.html');

const component: angular.IComponentOptions = {
  template: GrupoPrestacionMedicaListTemplate,
  controller: GrupoPrestacionMedicaListController,
  controllerAs: 'vm'
}

export class GrupoPrestacionMedicaListComponent {
  static init(ngModule: angular.IModule) {
    ngModule.component('saGrupoPrestacionMedicaList', component);
  }
}