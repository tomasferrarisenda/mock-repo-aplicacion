/**
* @author: ppautasso
* @description: modal para seleccionar el consultorio en view de consultorio medico
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { SeleccionarConsultorioMedicoModalController } from './SeleccionarConsultorioMedicoModalController';
const SeleccionarConsultorioMedicoModalTemplate = require('./SeleccionarConsultorioMedicoModalComponent.html');

// Unimos controller y template en el componente
const component: angular.IComponentOptions = {
	template: SeleccionarConsultorioMedicoModalTemplate,
	controller: SeleccionarConsultorioMedicoModalController,
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
export class SeleccionarConsultorioMedicoModalComponent {
	static init(ngModule: angular.IModule) {
		ngModule.component('saSeleccionarConsultorioMedicoModal', component);
	}
}