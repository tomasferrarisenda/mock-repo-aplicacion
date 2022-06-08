/**
* @author: ppautasso
* @description: componente contenedor para indicaciones medicas
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { FarmaciaIndicacionesMedicasController } from './FarmaciaIndicacionesMedicasController';
const FarmaciaIndicacionesMedicasTemplate = require('./FarmaciaIndicacionesMedicasComponent.html');

// Unimos controller y template en el componente
const component: angular.IComponentOptions = {
	template: FarmaciaIndicacionesMedicasTemplate,
	controller: FarmaciaIndicacionesMedicasController,
	controllerAs: 'vm'
}

// Se agrega el componente al módulo pasado por parámetros
export class FarmaciaIndicacionesMedicasComponent {
	static init(ngModule: angular.IModule) {
		ngModule.component('saFarmaciaIndicacionesMedicas', component);
	}
}