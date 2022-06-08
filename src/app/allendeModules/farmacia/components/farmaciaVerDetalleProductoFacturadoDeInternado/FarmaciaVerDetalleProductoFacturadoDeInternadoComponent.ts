/**
* @author: ppautasso
* @description: componente para ver detalle item en producto facturado
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { FarmaciaVerDetalleProductoFacturadoDeInternadoController } from './FarmaciaVerDetalleProductoFacturadoDeInternadoController';
const FarmaciaVerDetalleProductoFacturadoDeInternadoTemplate = require('./FarmaciaVerDetalleProductoFacturadoDeInternadoComponent.html');

// Unimos controller y template en el componente
const component: angular.IComponentOptions = {
	template: FarmaciaVerDetalleProductoFacturadoDeInternadoTemplate,
	controller: FarmaciaVerDetalleProductoFacturadoDeInternadoController,
	controllerAs: 'vm',
	bindings: {
		resolve: '<',
		close: '&',
		dismiss: '&'
	}
}

// Se agrega el componente al módulo pasado por parámetros
export class FarmaciaVerDetalleProductoFacturadoDeInternadoComponent {
	static init(ngModule: angular.IModule) {
		ngModule.component('saFarmaciaVerDetalleProductoFacturadoDeInternado', component);
	}
}