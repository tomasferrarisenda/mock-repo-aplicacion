/**
* @author: ppautasso
* @description: componente para agregar producto a deposito
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { FarmaciaAgregarProductoAStockController } from './FarmaciaAgregarProductoAStockController';
const FarmaciaAgregarProductoAStockTemplate = require('./FarmaciaAgregarProductoAStockComponent.html');

// Unimos controller y template en el componente
const component: angular.IComponentOptions = {
	template: FarmaciaAgregarProductoAStockTemplate,
	controller: FarmaciaAgregarProductoAStockController,
	controllerAs: 'vm',
	bindings: {
		resolve: '<',
		close: '&',
		dismiss: '&'
	}
}

// Se agrega el componente al módulo pasado por parámetros
export class FarmaciaAgregarProductoAStockComponent {
	static init(ngModule: angular.IModule) {
		ngModule.component('saFarmaciaAgregarProductoAStock', component);
	}
}