/**
* @author: ppautasso
* @description: componente para pestaña de devoluciones de indicaciones medicas en farmacia
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { FarmaciaDevolucionesIndicacionesMedicasController } from './FarmaciaDevolucionesIndicacionesMedicasController';
const FarmaciaDevolucionesIndicacionesMedicasTemplate = require('./FarmaciaDevolucionesIndicacionesMedicasComponent.html');

// Unimos controller y template en el componente
const component: angular.IComponentOptions = {
	template: FarmaciaDevolucionesIndicacionesMedicasTemplate,
	controller: FarmaciaDevolucionesIndicacionesMedicasController,
	controllerAs: 'vm',
	bindings: {
		facturar: '<',
		enfermeria: '<',
		textoBtnFacturar: '@?'
	}
}

// Se agrega el componente al módulo pasado por parámetros
export class FarmaciaDevolucionesIndicacionesMedicasComponent {
	static init(ngModule: angular.IModule) {
		ngModule.component('saFarmaciaDevolucionesIndicacionesMedicas', component);
	}
}