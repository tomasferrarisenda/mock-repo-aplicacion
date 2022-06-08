/**
* @author: rbassi
* @description: loteReceptarPorFiltroEdit component
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { loteReceptarPorFiltroEditController } from './loteReceptarPorFiltroEditController';
const loteReceptarPorFiltroEditTemplate = require('./loteReceptarPorFiltroEditComponent.html');

// Unimos controller y template en el componente
const component : angular.IComponentOptions = {
 template: loteReceptarPorFiltroEditTemplate,
 controller: loteReceptarPorFiltroEditController,
 controllerAs: 'vm'
}

// Se agrega el componente al módulo pasado por parámetros
export class loteReceptarPorFiltroEditComponent {
 static init(ngModule: angular.IModule) {
 ngModule.component('saLoteReceptarPorFiltroEdit', component);
 }
}