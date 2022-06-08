/**
* @author: rbassi
* @description: Edicion de Definitivo Component
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { definitivosEditController } from './definitivosEditController';
const definitivosEditTemplate = require('./definitivosEditComponent.html');

// Unimos controller y template en el componente
const component : angular.IComponentOptions = {
 template: definitivosEditTemplate,
 controller: definitivosEditController,
 controllerAs: 'vm'
}

// Se agrega el componente al módulo pasado por parámetros
export class definitivosEditComponent {
 static init(ngModule: angular.IModule) {
 ngModule.component('saDefinitivosEdit', component);
 }
}