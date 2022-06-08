/**
* @author: ppautasso
* @description: componente para imprimir un remito d emovimiento de stock farmacia/enfermeria
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { ImprimirRemitoMovimientoStockController } from './ImprimirRemitoMovimientoStockController';
const ImprimirRemitoMovimientoStockTemplate = require('./ImprimirRemitoMovimientoStockComponent.html');

// Unimos controller y template en el componente
const component: angular.IComponentOptions = {
	template: ImprimirRemitoMovimientoStockTemplate,
	controller: ImprimirRemitoMovimientoStockController,
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
export class ImprimirRemitoMovimientoStockComponent {
	static init(ngModule: angular.IModule) {
		ngModule.component('saImprimirRemitoMovimientoStock', component);
	}
}