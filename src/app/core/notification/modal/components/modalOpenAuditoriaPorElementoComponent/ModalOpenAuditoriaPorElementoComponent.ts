/**
* @author: ppautasso
* @description: componente tipo modal para levantar auditoria por id y endpoint
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { ModalOpenAuditoriaPorElementoController } from './ModalOpenAuditoriaPorElementoController';
const ModalOpenAuditoriaPorElementoTemplate = require('./ModalOpenAuditoriaPorElementoComponent.html');

// Unimos controller y template en el componente
const component: angular.IComponentOptions = {
	template: ModalOpenAuditoriaPorElementoTemplate,
	controller: ModalOpenAuditoriaPorElementoController,
	controllerAs: 'vm',
	bindings: {
		resolve: '<',	// por ser Modal. An object of the modal resolve values
		close: '&',		// por ser Modal. A method that can be used to close a modal, passing a result. 
		// 	Use: {$value: myResult}
		dismiss: '&',	// por ser Modal. A method that can be used to dismiss a modal, passing a result.
		// 	Use: {$value: myRejectedResult}

	}
}

// Se agrega el componente al módulo pasado por parámetros
export class ModalOpenAuditoriaPorElementoComponent {
	static init(ngModule: angular.IModule) {
		ngModule.component('saModalOpenAuditoriaPorElemento', component);
	}
}