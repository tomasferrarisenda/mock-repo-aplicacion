/**
* @author: ppautasso
* @description: componente de stock por piso de farmacia
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { FarmaciaStockController } from './FarmaciaStockController';
const FarmaciaStockTemplate = require('./FarmaciaStockComponent.html');

// Unimos controller y template en el componente
const component: angular.IComponentOptions = {
	template: FarmaciaStockTemplate,
	controller: FarmaciaStockController,
	controllerAs: 'vm'
}

// Se agrega el componente al módulo pasado por parámetros
export class FarmaciaStockComponent {
	static init(ngModule: angular.IModule) {
		ngModule.component('saFarmaciaStock', component);
	}
}