/**
* @author: ppautasso
* @description: componente para la lista de la agneda medica
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { ConsultorioMedicoAgendaListController } from './ConsultorioMedicoAgendaListController';
const ConsultorioMedicoAgendaListTemplate = require('./ConsultorioMedicoAgendaListComponent.html');

// Unimos controller y template en el componente
const component: angular.IComponentOptions = {
	template: ConsultorioMedicoAgendaListTemplate,
	controller: ConsultorioMedicoAgendaListController,
	controllerAs: 'vm'
}

// Se agrega el componente al módulo pasado por parámetros
export class ConsultorioMedicoAgendaListComponent {
	static init(ngModule: angular.IModule) {
		ngModule.component('saConsultorioMedicoAgendaList', component);
	}
}