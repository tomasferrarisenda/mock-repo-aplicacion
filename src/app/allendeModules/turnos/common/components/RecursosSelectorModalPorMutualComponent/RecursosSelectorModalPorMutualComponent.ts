/**
* @author: ppautasso
* @description: componente tipo modal para seleccionar recursos para turnos
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { RecursosSelectorModalPorMutualController } from './RecursosSelectorModalPorMutualController';
const RecursosSelectorModalPorMutualTemplate = require('./RecursosSelectorModalPorMutualComponent.html');

// Unimos controller y template en el componente
const component: angular.IComponentOptions = {
	template: RecursosSelectorModalPorMutualTemplate,
	controller: RecursosSelectorModalPorMutualController,
	controllerAs: 'vm',
	bindings:{
		resolve: '<',	// por ser Modal. An object of the modal resolve values
		close: '&',		// por ser Modal. A method that can be used to close a modal, passing a result. 
		// 	Use: {$value: myResult}
		dismiss: '&',	// por ser Modal. A method that can be used to dismiss a modal, passing a result.
        // 	Use: {$value: myRejectedResult}
	}
}

// Se agrega el componente al módulo pasado por parámetros
export class RecursosSelectorModalPorMutualComponent {
	static init(ngModule: angular.IModule) {
		ngModule.component('saRecursosSelectorModalPorMutual', component);
	}
}