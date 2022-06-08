/**
* @author: ppautasso
* @description: componente para imprimir remito en la entrega de productso de farmacia
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { FarmaciaImprimirRemitoEntregaProductosController } from './FarmaciaImprimirRemitoEntregaProductosController';
const FarmaciaImprimirRemitoEntregaProductosTemplate = require('./FarmaciaImprimirRemitoEntregaProductosComponent.html');

// Unimos controller y template en el componente
const component: angular.IComponentOptions = {
	template: FarmaciaImprimirRemitoEntregaProductosTemplate,
	controller: FarmaciaImprimirRemitoEntregaProductosController,
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
export class FarmaciaImprimirRemitoEntregaProductosComponent {
	static init(ngModule: angular.IModule) {
		ngModule.component('saFarmaciaImprimirRemitoEntregaProductos', component);
	}
}