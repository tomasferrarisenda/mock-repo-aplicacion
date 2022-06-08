/**
* @author: ppautasso
* @description: confirmacion de turnos list componente
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { ConfirmacionTurnosResultadosConfirmacionListController } from './ConfirmacionTurnosResultadosConfirmacionListController';
const ConfirmacionTurnosResultadosConfirmacionListTemplate = require('./ConfirmacionTurnosResultadosConfirmacionListComponent.html');

// Unimos controller y template en el componente
const component: angular.IComponentOptions = {
	template: ConfirmacionTurnosResultadosConfirmacionListTemplate,
	controller: ConfirmacionTurnosResultadosConfirmacionListController,
	controllerAs: 'vm'
}

// Se agrega el componente al módulo pasado por parámetros
export class ConfirmacionTurnosResultadosConfirmacionListComponent {
	static init(ngModule: angular.IModule) {
		ngModule.component('saConfirmacionTurnosResultadosConfirmacionList', component);
	}
}