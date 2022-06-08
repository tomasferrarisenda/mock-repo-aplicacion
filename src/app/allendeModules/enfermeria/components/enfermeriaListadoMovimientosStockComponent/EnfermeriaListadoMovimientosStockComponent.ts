/**
* @author: ppautasso
* @description: componente para el listdo de moviemientos de stock en enfermeria
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { EnfermeriaListadoMovimientosStockController } from './EnfermeriaListadoMovimientosStockController';
const EnfermeriaListadoMovimientosStockTemplate = require('./EnfermeriaListadoMovimientosStockComponent.html');

// Unimos controller y template en el componente
const component: angular.IComponentOptions = {
	template: EnfermeriaListadoMovimientosStockTemplate,
	controller: EnfermeriaListadoMovimientosStockController,
	controllerAs: 'vm'
}

// Se agrega el componente al módulo pasado por parámetros
export class EnfermeriaListadoMovimientosStockComponent {
	static init(ngModule: angular.IModule) {
		ngModule.component('saEnfermeriaListadoMovimientosStock', component);
	}
}