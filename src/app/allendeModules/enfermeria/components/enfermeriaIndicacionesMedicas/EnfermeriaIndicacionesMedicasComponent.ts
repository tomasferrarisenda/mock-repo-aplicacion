/**
* @author: ppautasso
* @description: componente para indicaciones medicas de enfermeria
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { EnfermeriaIndicacionesMedicasController } from './EnfermeriaIndicacionesMedicasController';
const EnfermeriaIndicacionesMedicasTemplate = require('./EnfermeriaIndicacionesMedicasComponent.html');

// Unimos controller y template en el componente
const component: angular.IComponentOptions = {
	template: EnfermeriaIndicacionesMedicasTemplate,
	controller: EnfermeriaIndicacionesMedicasController,
	controllerAs: 'vm'
}

// Se agrega el componente al módulo pasado por parámetros
export class EnfermeriaIndicacionesMedicasComponent {
	static init(ngModule: angular.IModule) {
		ngModule.component('saEnfermeriaIndicacionesMedicas', component);
	}
}