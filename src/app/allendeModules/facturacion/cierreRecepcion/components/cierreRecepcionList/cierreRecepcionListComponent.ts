/**
* @author: rbassi
* @description: cierre recepcion componente
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { cierreRecepcionListController } from './cierreRecepcionListController';
const cierreRecepcionListTemplate = require('./cierreRecepcionListComponent.html');

// Unimos controller y template en el componente
const component : angular.IComponentOptions = {
 template: cierreRecepcionListTemplate,
 controller: cierreRecepcionListController,
 controllerAs: 'vm'
}

// Se agrega el componente al módulo pasado por parámetros
export class cierreRecepcionListComponent {
 static init(ngModule: angular.IModule) {
 ngModule.component('saCierreRecepcionList', component);
 }
}	