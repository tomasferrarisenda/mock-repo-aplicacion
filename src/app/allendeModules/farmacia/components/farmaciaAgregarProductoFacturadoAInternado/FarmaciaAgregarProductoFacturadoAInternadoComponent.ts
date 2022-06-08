/**
* @author: ppautasso
* @description: componente para agregar producto facturado a un internado tipo modal
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { FarmaciaAgregarProductoFacturadoAInternadoController } from './FarmaciaAgregarProductoFacturadoAInternadoController';
const FarmaciaAgregarProductoFacturadoAInternadoTemplate = require('./FarmaciaAgregarProductoFacturadoAInternadoComponent.html');

// Unimos controller y template en el componente
const component: angular.IComponentOptions = {
	template: FarmaciaAgregarProductoFacturadoAInternadoTemplate,
	controller: FarmaciaAgregarProductoFacturadoAInternadoController,
	controllerAs: 'vm',
	bindings: {
		resolve: '<',
		close: '&',
		dismiss: '&'
	}
}

// Se agrega el componente al módulo pasado por parámetros
export class FarmaciaAgregarProductoFacturadoAInternadoComponent {
	static init(ngModule: angular.IModule) {
		ngModule.component('saFarmaciaAgregarProductoFacturadoAInternado', component);
	}
}