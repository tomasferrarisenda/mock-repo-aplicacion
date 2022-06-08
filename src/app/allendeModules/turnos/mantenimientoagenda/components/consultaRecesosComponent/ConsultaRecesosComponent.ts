/**
* @author: pablo pautassso
* @description: componente para la consulta de recesos
* @type: Component
**/
import * as angular from 'angular';
import { ConsultaRecesosController } from './ConsultaRecesosController';
const ConsultaRecesosTemplate = require('./ConsultaRecesosComponent.html');

const component: angular.IComponentOptions = {
	template: ConsultaRecesosTemplate,
	bindings: {
		resolve: '<',	// por ser Modal. An object of the modal resolve values
		close: '&',		// por ser Modal. A method that can be used to close a modal, passing a result. 
		// 	Use: {$value: myResult}
		dismiss: '&',	// por ser Modal. A method that can be used to dismiss a modal, passing a result.
		// 	Use: {$value: myRejectedResult}

	},
	controller: ConsultaRecesosController,
	controllerAs: 'vm',
	
}

export class ConsultaRecesosComponent {
	static init(ngModule: angular.IModule) {
		ngModule.component('saConsultaRecesos', component);
	}
}