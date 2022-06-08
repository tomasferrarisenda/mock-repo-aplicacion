/**
* @author: rbassi
* @description: component de items prefacturados pendientes
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { itemsPrefacturadosPendientesListController } from './itemsPrefacturadosPendientesListController';
const itemsPrefacturadosPendientesListTemplate = require('./itemsPrefacturadosPendientesListComponent.html');

// Unimos controller y template en el componente
const component : angular.IComponentOptions = {
 template: itemsPrefacturadosPendientesListTemplate,
 controller: itemsPrefacturadosPendientesListController,
 controllerAs: 'vm'
}

// Se agrega el componente al módulo pasado por parámetros
export class itemsPrefacturadosPendientesListComponent {
 static init(ngModule: angular.IModule) {
 ngModule.component('saItemsPrefacturadosPendientesList', component);
 }
}