/**
* @author: ppautasso
* @description: componente para lista de programaciones en confirmacion de turnos
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { ConfirmacionTurnosProgramacionesListController } from './ConfirmacionTurnosProgramacionesListController';
const ConfirmacionTurnosProgramacionesListTemplate = require('./ConfirmacionTurnosProgramacionesListComponent.html');

// Unimos controller y template en el componente
const component: angular.IComponentOptions = {
	template: ConfirmacionTurnosProgramacionesListTemplate,
	controller: ConfirmacionTurnosProgramacionesListController,
	controllerAs: 'vm'
}

// Se agrega el componente al módulo pasado por parámetros
export class ConfirmacionTurnosProgramacionesListComponent {
	static init(ngModule: angular.IModule) {
		ngModule.component('saConfirmacionTurnosProgramacionesList', component);
	}
}