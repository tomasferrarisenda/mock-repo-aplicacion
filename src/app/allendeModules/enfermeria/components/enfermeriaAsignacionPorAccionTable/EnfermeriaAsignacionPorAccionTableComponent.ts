/**
* @author: ppautasso 
* @description: componente para tabla de asignacion de enfermeria por accion
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { EnfermeriaAsignacionPorAccionTableController } from './EnfermeriaAsignacionPorAccionTableController';
const EnfermeriaAsignacionPorAccionTableTemplate = require('./EnfermeriaAsignacionPorAccionTableComponent.html');

// Unimos controller y template en el componente
const component: angular.IComponentOptions = {
	template: EnfermeriaAsignacionPorAccionTableTemplate,
	controller: EnfermeriaAsignacionPorAccionTableController,
	controllerAs: 'vm',
	bindings: {
		data: '=',
		titleColumn: '@?',
		tipoAccion: '<',
		
	}
}

// Se agrega el componente al módulo pasado por parámetros
export class EnfermeriaAsignacionPorAccionTableComponent {
	static init(ngModule: angular.IModule) {
		ngModule.component('saEnfermeriaAsignacionPorAccionTable', component);
	}
}