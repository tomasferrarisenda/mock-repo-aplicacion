/**
* @author: ppautasso
* @description: componente para mostrar las indicaciones medicas en enfermeria
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { EnfermeriaListadoIndicacionesMedicasTabController } from './EnfermeriaListadoIndicacionesMedicasTabController';
const EnfermeriaListadoIndicacionesMedicasTabTemplate = require('./EnfermeriaListadoIndicacionesMedicasTabComponent.html');

// Unimos controller y template en el componente
const component: angular.IComponentOptions = {
	template: EnfermeriaListadoIndicacionesMedicasTabTemplate,
	controller: EnfermeriaListadoIndicacionesMedicasTabController,
	controllerAs: 'vm'
}

// Se agrega el componente al módulo pasado por parámetros
export class EnfermeriaListadoIndicacionesMedicasTabComponent {
	static init(ngModule: angular.IModule) {
		ngModule.component('saEnfermeriaListadoIndicacionesMedicasTab', component);
	}
}