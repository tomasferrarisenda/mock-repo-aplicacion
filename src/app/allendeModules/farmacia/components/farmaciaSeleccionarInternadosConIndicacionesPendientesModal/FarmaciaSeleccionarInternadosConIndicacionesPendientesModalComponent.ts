/**
* @author: ppautasso
* @description: componente tipo modal para seleccionar internados que tienen indicaciones pendientes 
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { FarmaciaSeleccionarInternadosConIndicacionesPendientesModalController } from './FarmaciaSeleccionarInternadosConIndicacionesPendientesModalController';
const FarmaciaSeleccionarInternadosConIndicacionesPendientesModalTemplate = require('./FarmaciaSeleccionarInternadosConIndicacionesPendientesModalComponent.html');

// Unimos controller y template en el componente
const component: angular.IComponentOptions = {
	template: FarmaciaSeleccionarInternadosConIndicacionesPendientesModalTemplate,
	controller: FarmaciaSeleccionarInternadosConIndicacionesPendientesModalController,
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
export class FarmaciaSeleccionarInternadosConIndicacionesPendientesModalComponent {
	static init(ngModule: angular.IModule) {
		ngModule.component('saFarmaciaSeleccionarInternadosConIndicacionesPendientesModal', component);
	}
}