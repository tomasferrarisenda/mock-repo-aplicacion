/**
* @author: ppautasso
* @description: componente tipo contenedor de vista para facturacion de farmacia
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { FarmaciaFacturacionContenedorController } from './FarmaciaFacturacionContenedorController';
const FarmaciaFacturacionContenedorTemplate = require('./FarmaciaFacturacionContenedorComponent.html');

// Unimos controller y template en el componente
const component: angular.IComponentOptions = {
	template: FarmaciaFacturacionContenedorTemplate,
	controller: FarmaciaFacturacionContenedorController,
	controllerAs: 'vm',
	bindings: {
		editPrecio: '<'
	}
}

// Se agrega el componente al módulo pasado por parámetros
export class FarmaciaFacturacionContenedorComponent {
	static init(ngModule: angular.IModule) {
		ngModule.component('saFarmaciaFacturacionContenedor', component);
	}
}