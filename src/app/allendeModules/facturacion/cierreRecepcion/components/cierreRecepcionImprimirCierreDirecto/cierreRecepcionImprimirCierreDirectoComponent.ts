/**
* @author: rbassi
* @description: componente Impresion de Cierre Directo
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { cierreRecepcionImprimirCierreDirectoController } from './cierreRecepcionImprimirCierreDirectoController';
const cierreRecepcionImprimirCierreDirectoTemplate = require('./cierreRecepcionImprimirCierreDirectoComponent.html');

// Unimos controller y template en el componente
const component : angular.IComponentOptions = {
 template: cierreRecepcionImprimirCierreDirectoTemplate,
 controller: cierreRecepcionImprimirCierreDirectoController,
 controllerAs: 'vm',
 bindings: {
 resolve: '<', // por ser Modal. An object of the modal resolve values
 close: '&', // por ser Modal. A method that can be used to close a modal, passing a result. 
 // Use: {$value: myResult}
 dismiss: '&' // por ser Modal. A method that can be used to dismiss a modal, passing a result.
 // Use: {$value: myRejectedResult}
 }
}

// Se agrega el componente al módulo pasado por parámetros
export class cierreRecepcionImprimirCierreDirectoComponent {
 static init(ngModule: angular.IModule) {
 ngModule.component('saCierreRecepcionImprimirCierreDirecto', component);
 }
}	