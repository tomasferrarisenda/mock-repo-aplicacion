/**
* @author: Pablo Pautasso
* @description: Componente para observaciones por sucursales
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { ObservacionPorSucursalesController } from './ObservacionPorSucursalesController';
const ObservacionPorSucursalesTemplate = require('./ObservacionPorSucursalesComponent.html');

// Unimos controller y template en el componente
const component: angular.IComponentOptions = {
	template: ObservacionPorSucursalesTemplate,
	bindings: {
		resolve: '<',	// por ser Modal. An object of the modal resolve values
		close: '&',		// por ser Modal. A method that can be used to close a modal, passing a result. 
		// 	Use: {$value: myResult}
		dismiss: '&',	// por ser Modal. A method that can be used to dismiss a modal, passing a result.
		// 	Use: {$value: myRejectedResult}

	},
	controller: ObservacionPorSucursalesController,
	controllerAs: 'vm'
}

// Se agrega el componente al módulo pasado por parámetros
export class ObservacionPorSucursalesComponent {
	static init(ngModule: angular.IModule) {
		ngModule.component('saObservacionPorSucursales', component);
	}
}