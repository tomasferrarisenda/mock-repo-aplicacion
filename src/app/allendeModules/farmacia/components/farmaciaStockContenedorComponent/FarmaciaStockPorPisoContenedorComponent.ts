/**
* @author: ppautasso
* @description: componente contenedor general para stock por piso farmacia
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { FarmaciaStockPorPisoContenedorController } from './FarmaciaStockPorPisoContenedorController';
const FarmaciaStockPorPisoContenedorTemplate = require('./FarmaciaStockPorPisoContenedorComponent.html');

// Unimos controller y template en el componente
const component: angular.IComponentOptions = {
	template: FarmaciaStockPorPisoContenedorTemplate,
	controller: FarmaciaStockPorPisoContenedorController,
	controllerAs: 'vm'
}

// Se agrega el componente al módulo pasado por parámetros
export class FarmaciaStockPorPisoContenedorComponent {
	static init(ngModule: angular.IModule) {
		ngModule.component('saFarmaciaStockPorPisoContenedor', component);
	}
}