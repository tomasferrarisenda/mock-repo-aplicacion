/**
* @author: ppautasso
* @description: componente de configuracion tipo modal
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { ModalConfigOptionsController } from './ModalConfigOptionsController';
const ModalConfigOptionsTemplate = require('./ModalConfigOptionsComponent.html');

// Unimos controller y template en el componente
const component: angular.IComponentOptions = {
	template: ModalConfigOptionsTemplate,
	bindings: {
		resolve: '<',	// por ser Modal. An object of the modal resolve values
		close: '&',		// por ser Modal. A method that can be used to close a modal, passing a result. 
		// 	Use: {$value: myResult}
		dismiss: '&',	// por ser Modal. A method that can be used to dismiss a modal, passing a result.
		// 	Use: {$value: myRejectedResult}

	},
	controller: ModalConfigOptionsController,
	controllerAs: 'vm'
}

// Se agrega el componente al módulo pasado por parámetros
export class ModalConfigOptionsComponent {
	static init(ngModule: angular.IModule) {
		ngModule.component('saModalConfigOptions', component);
	}
}