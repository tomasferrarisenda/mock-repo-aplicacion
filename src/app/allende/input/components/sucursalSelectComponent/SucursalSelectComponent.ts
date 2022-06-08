/**
* @author: ppautasso
* @description: componente para select de sucursal
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { SucursalSelectController } from './SucursalSelectController';
const SucursalSelectTemplate = require('./SucursalSelectComponent.html');

// Unimos controller y template en el componente
const component: angular.IComponentOptions = {
	template: SucursalSelectTemplate,
	controller: SucursalSelectController,
	controllerAs: 'vm',
	bindings: {
		ifLabel: '<?',
		sucursal: '=',
		todasOption: '<?',
		disabled: '<?'
		
	}
}

// Se agrega el componente al módulo pasado por parámetros
export class SucursalSelectComponent {
	static init(ngModule: angular.IModule) {
		ngModule.component('saSucursalSelect', component);
	}
}