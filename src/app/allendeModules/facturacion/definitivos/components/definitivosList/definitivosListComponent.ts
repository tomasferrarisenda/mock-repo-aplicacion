/**
* @author: rbassi
* @description: Definitivos para el financiador 
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { definitivosListController } from './definitivosListController';
const definitivosListTemplate = require('./definitivosListComponent.html');

// Unimos controller y template en el componente
const component : angular.IComponentOptions = {
 template: definitivosListTemplate,
 controller: definitivosListController,
 controllerAs: 'vm'
}

// Se agrega el componente al módulo pasado por parámetros
export class definitivosListComponent {
 static init(ngModule: angular.IModule) {
 ngModule.component('saDefinitivosList', component);
 }
}