/**
* @author: ppautasso
* @description: componente para la lsit de logs de ejecuciones
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { ConfirmacionTurnosLogsEjecucionesListController } from './ConfirmacionTurnosLogsEjecucionesListController';
const ConfirmacionTurnosLogsEjecucionesListTemplate = require('./ConfirmacionTurnosLogsEjecucionesListComponent.html');

// Unimos controller y template en el componente
const component: angular.IComponentOptions = {
	template: ConfirmacionTurnosLogsEjecucionesListTemplate,
	controller: ConfirmacionTurnosLogsEjecucionesListController,
	controllerAs: 'vm'
}

// Se agrega el componente al módulo pasado por parámetros
export class ConfirmacionTurnosLogsEjecucionesListComponent {
	static init(ngModule: angular.IModule) {
		ngModule.component('saConfirmacionTurnosLogsEjecucionesList', component);
	}
}