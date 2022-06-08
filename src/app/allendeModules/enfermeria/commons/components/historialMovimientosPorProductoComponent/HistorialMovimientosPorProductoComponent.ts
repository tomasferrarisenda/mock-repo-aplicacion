/**
* @author: ppautasso
* @description: componente para ver historial de movimientos por producto tipo modal
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { HistorialMovimientosPorProductoController } from './HistorialMovimientosPorProductoController';
const HistorialMovimientosPorProductoTemplate = require('./HistorialMovimientosPorProductoComponent.html');

// Unimos controller y template en el componente
const component: angular.IComponentOptions = {
	template: HistorialMovimientosPorProductoTemplate,
	controller: HistorialMovimientosPorProductoController,
	controllerAs: 'vm',
	bindings: {
		resolve: '<',
		close: '&',
		dismiss: '&'
	}
}

// Se agrega el componente al módulo pasado por parámetros
export class HistorialMovimientosPorProductoComponent {
	static init(ngModule: angular.IModule) {
		ngModule.component('saHistorialMovimientosPorProducto', component);
	}
}