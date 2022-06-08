/**
* @author: ppautasso
* @description: componente para mostrar las prestaciones que hace un recurso en un servicio y sucursal
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { PrestacionesPorRecursoYServicioModalController } from './PrestacionesPorRecursoYServicioModalController';
const PrestacionesPorRecursoYServicioModalTemplate = require('./PrestacionesPorRecursoYServicioModalComponent.html');

// Unimos controller y template en el componente
const component: angular.IComponentOptions = {
	template: PrestacionesPorRecursoYServicioModalTemplate,
	controller: PrestacionesPorRecursoYServicioModalController,
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
export class PrestacionesPorRecursoYServicioModalComponent {
	static init(ngModule: angular.IModule) {
		ngModule.component('saPrestacionesPorRecursoYServicioModal', component);
	}
}