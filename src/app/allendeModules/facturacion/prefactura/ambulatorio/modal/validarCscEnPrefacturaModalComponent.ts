/**
 * @author: ppautasso
 * @description: modal para validar el CSC de una o social
 * @type: Component
 **/
import * as angular from 'angular';
// Importamos controller y template
import {
	validarCscEnPrefacturaModalController
} from './validarCscEnPrefacturaModalController';
const validarCscEnPrefacturaModalTemplate = require('./validarCscEnPrefacturaModalComponent.html');

// Unimos controller y template en el componente
const component: angular.IComponentOptions = {
	template: validarCscEnPrefacturaModalTemplate,
	controller: validarCscEnPrefacturaModalController,
	controllerAs: 'vm',
	bindings: {
		resolve: '<', // por ser Modal. An object of the modal resolve values
		close: '&', // por ser Modal. A method that can be used to close a modal, passing a result. 
		// Use: {$value: myResult}
		dismiss: '&' // por ser Modal. A method that can be used to dismiss a modal, passing a result.
		// Use: {$value: myRejectedResult}
	}
}

// Se agrega el componente al módulo pasado por parámetros
export class validarCscEnPrefacturaModalComponent {
	static init(ngModule: angular.IModule) {
		ngModule.component('saValidarCscEnPrefacturaModal', component);
	}
}