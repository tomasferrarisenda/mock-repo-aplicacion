/**
* @author: ppautasso
* @description: componente generico/contenedor para la gestion de enfermeras
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { EnfermeriaGestionEnfermerasController } from './EnfermeriaGestionEnfermerasController';
const EnfermeriaGestionEnfermerasTemplate = require('./EnfermeriaGestionEnfermerasComponent.html');

// Unimos controller y template en el componente
const component: angular.IComponentOptions = {
	template: EnfermeriaGestionEnfermerasTemplate,
	controller: EnfermeriaGestionEnfermerasController,
	controllerAs: 'vm'
}

// Se agrega el componente al módulo pasado por parámetros
export class EnfermeriaGestionEnfermerasComponent {
	static init(ngModule: angular.IModule) {
		ngModule.component('saEnfermeriaGestionEnfermeras', component);
	}
}