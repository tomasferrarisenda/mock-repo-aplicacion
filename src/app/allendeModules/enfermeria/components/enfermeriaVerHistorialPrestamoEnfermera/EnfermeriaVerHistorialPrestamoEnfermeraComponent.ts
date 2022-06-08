/**
* @author: ppautasso
* @description: componente para ver el historial de prestamo de enfermeras
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { EnfermeriaVerHistorialPrestamoEnfermeraController } from './EnfermeriaVerHistorialPrestamoEnfermeraController';
const EnfermeriaVerHistorialPrestamoEnfermeraTemplate = require('./EnfermeriaVerHistorialPrestamoEnfermeraComponent.html');

// Unimos controller y template en el componente
const component: angular.IComponentOptions = {
	template: EnfermeriaVerHistorialPrestamoEnfermeraTemplate,
	controller: EnfermeriaVerHistorialPrestamoEnfermeraController,
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
export class EnfermeriaVerHistorialPrestamoEnfermeraComponent {
	static init(ngModule: angular.IModule) {
		ngModule.component('saEnfermeriaVerHistorialPrestamoEnfermera', component);
	}
}