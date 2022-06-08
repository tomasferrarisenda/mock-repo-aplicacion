/**
* @author: rbassi
* @description: lote Recepcion Component 
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { loteReceptarListController } from './loteReceptarListController';
const loteReceptarListTemplate = require('./loteReceptarListComponent.html');

// Unimos controller y template en el componente
const component : angular.IComponentOptions = {
 template: loteReceptarListTemplate,
 controller: loteReceptarListController,
 controllerAs: 'vm'
}

// Se agrega el componente al módulo pasado por parámetros
export class loteReceptarListComponent {
 static init(ngModule: angular.IModule) {
 ngModule.component('saLoteReceptarList', component);
 }
}