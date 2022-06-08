/**
* @author: ppautasso
* @description: componente para el tab de farmacia para mostrar indicaciones
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { FarmaciaListadoIndicacionesTabController } from './FarmaciaListadoIndicacionesTabController';
const FarmaciaListadoIndicacionesTabTemplate = require('./FarmaciaListadoIndicacionesTabComponent.html');

// Unimos controller y template en el componente
const component: angular.IComponentOptions = {
	template: FarmaciaListadoIndicacionesTabTemplate,
	controller: FarmaciaListadoIndicacionesTabController,
	controllerAs: 'vm'
}

// Se agrega el componente al módulo pasado por parámetros
export class FarmaciaListadoIndicacionesTabComponent {
	static init(ngModule: angular.IModule) {
		ngModule.component('saFarmaciaListadoIndicacionesTab', component);
	}
}