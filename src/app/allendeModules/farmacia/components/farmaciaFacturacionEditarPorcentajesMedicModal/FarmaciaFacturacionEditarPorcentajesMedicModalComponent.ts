/**
* @author: ppautasso
* @description: componente modal para editar el porcentaje de los medicamentos
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { FarmaciaFacturacionEditarPorcentajesMedicModalController } from './FarmaciaFacturacionEditarPorcentajesMedicModalController';
const FarmaciaFacturacionEditarPorcentajesMedicModalTemplate = require('./FarmaciaFacturacionEditarPorcentajesMedicModalComponent.html');

// Unimos controller y template en el componente
const component: angular.IComponentOptions = {
	template: FarmaciaFacturacionEditarPorcentajesMedicModalTemplate,
	controller: FarmaciaFacturacionEditarPorcentajesMedicModalController,
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
export class FarmaciaFacturacionEditarPorcentajesMedicModalComponent {
	static init(ngModule: angular.IModule) {
		ngModule.component('saFarmaciaFacturacionEditarPorcentajesMedicModal', component);
	}
}