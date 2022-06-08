/**
* @author: ppautasso
* @description: componente de modal para entregar producto por ventanilla en farmacia
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { FarmaciaEntregarProductosVentanillaModalController } from './FarmaciaEntregarProductosVentanillaModalController';
const FarmaciaEntregarProductosVentanillaModalTemplate = require('./FarmaciaEntregarProductosVentanillaModalComponent.html');

// Unimos controller y template en el componente
const component: angular.IComponentOptions = {
	template: FarmaciaEntregarProductosVentanillaModalTemplate,
	controller: FarmaciaEntregarProductosVentanillaModalController,
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
export class FarmaciaEntregarProductosVentanillaModalComponent {
	static init(ngModule: angular.IModule) {
		ngModule.component('saFarmaciaEntregarProductosVentanillaModal', component);
	}
}