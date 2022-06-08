/**
* @author: ppautasso
* @description: componente para ver la auditoria de un movimiento
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { EnfermeriaVerAuditoriaMovimientoController } from './EnfermeriaVerAuditoriaMovimientoController';
const EnfermeriaVerAuditoriaMovimientoTemplate = require('./EnfermeriaVerAuditoriaMovimientoComponent.html');

// Unimos controller y template en el componente
const component: angular.IComponentOptions = {
	template: EnfermeriaVerAuditoriaMovimientoTemplate,
	controller: EnfermeriaVerAuditoriaMovimientoController,
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
export class EnfermeriaVerAuditoriaMovimientoComponent {
	static init(ngModule: angular.IModule) {
		ngModule.component('saEnfermeriaVerAuditoriaMovimiento', component);
	}
}