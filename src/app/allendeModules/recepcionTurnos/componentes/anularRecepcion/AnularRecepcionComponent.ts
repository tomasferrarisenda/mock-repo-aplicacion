/**
* @author: rbassi
* @description: anular Recepcion
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { AnularRecepcionController } from './AnularRecepcionController';
const AnularRecepcionTemplate = require('./AnularRecepcion.html');

// Unimos controller y template en el componente
const component: angular.IComponentOptions = {
	template: AnularRecepcionTemplate,
	controller: AnularRecepcionController,
	controllerAs: 'vm',
	bindings: {
		resolve: '<', // por ser Modal. An object of the modal resolve values
		close: '&', // por ser Modal. A method that can be used to close a modal, passing a result. 
		// Use: {$value: myResult}
		dismiss: '&' // por ser Modal. A method that can be used to dismiss a modal, passing a result.
	}
}

// Se agrega el componente al módulo pasado por parámetros
export class AnularRecepcionComponent {
	static init(ngModule: angular.IModule) {
		ngModule.component('saAnularRecepcion', component);
	}
}	