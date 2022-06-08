/**
* @author: rbassi
* @description: ListasFacturacion
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { listasFacturacionListController } from './listasFacturacionListController';
const listasFacturacionListTemplate = require('./listasFacturacionListComponent.html');

// Unimos controller y template en el componente
const component : angular.IComponentOptions = {
 template: listasFacturacionListTemplate,
 controller: listasFacturacionListController,
 controllerAs: 'vm'
}

// Se agrega el componente al módulo pasado por parámetros
export class listasFacturacionListComponent {
 static init(ngModule: angular.IModule) {
 ngModule.component('saListasFacturacionList', component);
 }
}	