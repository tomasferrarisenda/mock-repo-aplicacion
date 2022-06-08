/**
* @author: ppautasso
* @description: componente modal para otorgar suero en enfermeria
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { EnfermeriaColocarSueroModalController } from './EnfermeriaColocarSueroModalController';
const EnfermeriaColocarSueroModalTemplate = require('./EnfermeriaColocarSueroModalComponent.html');

// Unimos controller y template en el componente
const component: angular.IComponentOptions = {
	template: EnfermeriaColocarSueroModalTemplate,
	controller: EnfermeriaColocarSueroModalController,
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
export class EnfermeriaColocarSueroModalComponent {
	static init(ngModule: angular.IModule) {
		ngModule.component('saEnfermeriaColocarSueroModal', component);
	}
}