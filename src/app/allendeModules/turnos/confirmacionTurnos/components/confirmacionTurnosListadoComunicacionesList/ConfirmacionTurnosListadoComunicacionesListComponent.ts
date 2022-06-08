/**
* @author: ppautasso
* @description: componente para mostrar listado de comunicaciones 
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { ConfirmacionTurnosListadoComunicacionesListController } from './ConfirmacionTurnosListadoComunicacionesListController';
const ConfirmacionTurnosListadoComunicacionesListTemplate = require('./ConfirmacionTurnosListadoComunicacionesListComponent.html');

// Unimos controller y template en el componente
const component: angular.IComponentOptions = {
	template: ConfirmacionTurnosListadoComunicacionesListTemplate,
	controller: ConfirmacionTurnosListadoComunicacionesListController,
	controllerAs: 'vm'
}

// Se agrega el componente al módulo pasado por parámetros
export class ConfirmacionTurnosListadoComunicacionesListComponent {
	static init(ngModule: angular.IModule) {
		ngModule.component('saConfirmacionTurnosListadoComunicacionesList', component);
	}
}