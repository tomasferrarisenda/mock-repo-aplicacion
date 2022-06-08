/**
* @author: ppautasso
* @description: componente para selector de piso
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { PisoSelectorController } from './PisoSelectorController';
const PisoSelectorTemplate = require('./PisoSelectorComponent.html');

// Unimos controller y template en el componente
const component: angular.IComponentOptions = {
	template: PisoSelectorTemplate,
	controller: PisoSelectorController,
	controllerAs: 'vm',
	bindings: {
		piso: '=',
		sucursal: '<',
		loading: '=?'
	}
}

// Se agrega el componente al módulo pasado por parámetros
export class PisoSelectorComponent {
	static init(ngModule: angular.IModule) {
		ngModule.component('saPisoSelector', component);
	}
}