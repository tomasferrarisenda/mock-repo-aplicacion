/**
* @author: ppautasso
* @description: componente tipo modal para entrega de productos en farmacia
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { FarmaciaEntregarProductosPorSectorModalController } from './FarmaciaEntregarProductosPorSectorModalController';
const FarmaciaEntregarProductosPorSectorModalTemplate = require('./FarmaciaEntregarProductosPorSectorModalComponent.html');

// Unimos controller y template en el componente
const component : angular.IComponentOptions = {
 template: FarmaciaEntregarProductosPorSectorModalTemplate,
 controller: FarmaciaEntregarProductosPorSectorModalController,
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
export class FarmaciaEntregarProductosPorSectorModalComponent {
 static init(ngModule: angular.IModule) {
 ngModule.component('saFarmaciaEntregarProductosPorSectorModal', component);
 }
}