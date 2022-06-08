/**
* @author: ppautasso
* @description: componente para editar el stock normal de un producto
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { FarmaciaEditarStockNormalDeProductoController } from './FarmaciaEditarStockNormalDeProductoController';
const FarmaciaEditarStockNormalDeProductoTemplate = require('./FarmaciaEditarStockNormalDeProductoComponent.html');

// Unimos controller y template en el componente
const component: angular.IComponentOptions = {
	template: FarmaciaEditarStockNormalDeProductoTemplate,
	controller: FarmaciaEditarStockNormalDeProductoController,
	controllerAs: 'vm',
	bindings: {
		resolve: '<',
		close: '&',
		dismiss: '&'
	}
}

// Se agrega el componente al módulo pasado por parámetros
export class FarmaciaEditarStockNormalDeProductoComponent {
	static init(ngModule: angular.IModule) {
		ngModule.component('saFarmaciaEditarStockNormalDeProducto', component);
	}
}