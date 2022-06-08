/**
* @author: ppautasso
* @description: componente para validacion de indicaciones medicas
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { FarmaciaValidacionIndicacionesMedicasController } from './FarmaciaValidacionIndicacionesMedicasController';
const FarmaciaValidacionIndicacionesMedicasTemplate = require('./FarmaciaValidacionIndicacionesMedicasComponent.html');

// Unimos controller y template en el componente
const component: angular.IComponentOptions = {
	template: FarmaciaValidacionIndicacionesMedicasTemplate,
	controller: FarmaciaValidacionIndicacionesMedicasController,
	controllerAs: 'vm'
}

// Se agrega el componente al módulo pasado por parámetros
export class FarmaciaValidacionIndicacionesMedicasComponent {
	static init(ngModule: angular.IModule) {
		ngModule.component('saFarmaciaValidacionIndicacionesMedicas', component);
	}
}