/**
* @author: rbassi
* @description: cierre Recepcion Edit
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { cierreRecepcionEditController } from './cierreRecepcionEditController';
const cierreRecepcionEditTemplate = require('./cierreRecepcionEditComponent.html');

// Unimos controller y template en el componente
const component : angular.IComponentOptions = {
 template: cierreRecepcionEditTemplate,
 controller: cierreRecepcionEditController,
 controllerAs: 'vm'
}

// Se agrega el componente al módulo pasado por parámetros
export class cierreRecepcionEditComponent {
 static init(ngModule: angular.IModule) {
 ngModule.component('saCierreRecepcionEdit', component);
 }
}	
