/**
* @author: ppautasso
* @description: componente para la configuracion del stock 
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { FarmaciaConfiguracionStockController } from './FarmaciaConfiguracionStockController';
const FarmaciaConfiguracionStockTemplate = require('./FarmaciaConfiguracionStockComponent.html');

// Unimos controller y template en el componente
const component: angular.IComponentOptions = {
	template: FarmaciaConfiguracionStockTemplate,
	controller: FarmaciaConfiguracionStockController,
	controllerAs: 'vm'
}

// Se agrega el componente al módulo pasado por parámetros
export class FarmaciaConfiguracionStockComponent {
	static init(ngModule: angular.IModule) {
		ngModule.component('saFarmaciaConfiguracionStock', component);
	}
}