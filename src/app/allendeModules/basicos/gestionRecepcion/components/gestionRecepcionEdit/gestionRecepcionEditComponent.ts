/**
* @author: crusso
* @description: gestionRecepcion Edit Component
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { gestionRecepcionEditController } from './gestionRecepcionEditController';
const gestionRecepcionEditTemplate = require('./gestionRecepcionEditComponent.html');

// Unimos controller y template en el componente
const component : angular.IComponentOptions = {
 template: gestionRecepcionEditTemplate,
 controller: gestionRecepcionEditController,
 controllerAs: 'vm'
}

// Se agrega el componente al módulo pasado por parámetros
export class gestionRecepcionEditComponent {
 static init(ngModule: angular.IModule) {
 ngModule.component('saGestionRecepcionEdit', component);
 }
}