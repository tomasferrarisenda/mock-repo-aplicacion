/**
* @author: Pablo Pautasso
* @description: Modal para ver los motivos de cancelacion de un turno
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { VerMotivosCancelacionTurnoController } from './VerMotivosCancelacionTurnoController';
const VerMotivosCancelacionTurnoTemplate = require('./VerMotivosCancelacionTurnoComponent.html');

// Unimos controller y template en el componente
const component: angular.IComponentOptions = {
	template: VerMotivosCancelacionTurnoTemplate,
	controller: VerMotivosCancelacionTurnoController,
	controllerAs: 'vm',
	bindings: {
		resolve: '<',	// por ser Modal. An object of the modal resolve values
		close: '&',		// por ser Modal. A method that can be used to close a modal, passing a result. 
		// 	Use: {$value: myResult}
		dismiss: '&',	// por ser Modal. A method that can be used to dismiss a modal, passing a result.
		// 	Use: {$value: myRejectedResult}

	},
}

// Se agrega el componente al módulo pasado por parámetros
export class VerMotivosCancelacionTurnoComponent {
	static init(ngModule: angular.IModule) {
		ngModule.component('saVerMotivosCancelacionTurno', component);
	}
}