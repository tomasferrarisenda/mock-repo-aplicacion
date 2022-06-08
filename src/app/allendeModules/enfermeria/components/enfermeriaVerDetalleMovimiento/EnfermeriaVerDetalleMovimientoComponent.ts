/**
* @author: ppautasso
* @description: componente para modal de ver detalle d emovimiento de enfemeria
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { EnfermeriaVerDetalleMovimientoController } from './EnfermeriaVerDetalleMovimientoController';
const EnfermeriaVerDetalleMovimientoTemplate = require('./EnfermeriaVerDetalleMovimientoComponent.html');

// Unimos controller y template en el componente
const component: angular.IComponentOptions = {
	template: EnfermeriaVerDetalleMovimientoTemplate,
	controller: EnfermeriaVerDetalleMovimientoController,
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
export class EnfermeriaVerDetalleMovimientoComponent {
	static init(ngModule: angular.IModule) {
		ngModule.component('saEnfermeriaVerDetalleMovimiento', component);
	}
}