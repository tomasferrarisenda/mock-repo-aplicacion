/**
* @author: ppautasso
* @description: compoonente para la asignacion de stock en enfermeria
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { EnfermeriaAsignacionController } from './EnfermeriaAsignacionController';
const EnfermeriaAsignacionTemplate = require('./EnfermeriaAsignacionComponent.html');

// Unimos controller y template en el componente
const component: angular.IComponentOptions = {
	template: EnfermeriaAsignacionTemplate,
	controller: EnfermeriaAsignacionController,
	controllerAs: 'vm'
}

// Se agrega el componente al módulo pasado por parámetros
export class EnfermeriaAsignacionComponent {
	static init(ngModule: angular.IModule) {
		ngModule.component('saEnfermeriaAsignacion', component);
	}
}