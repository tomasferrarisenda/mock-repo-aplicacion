/**
* @author: ppautasso
* @description: selector de profesionales que atienden un aparato
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { SelectorProfesionalAtiendeController } from './SelectorProfesionalAtiendeController';
const SelectorProfesionalAtiendeTemplate = require('./SelectorProfesionalAtiendeComponent.html');

// Unimos controller y template en el componente
const component: angular.IComponentOptions = {
	template: SelectorProfesionalAtiendeTemplate,
	controller: SelectorProfesionalAtiendeController,
	controllerAs: 'vm',
	bindings:{
		loading: '=?',
		aparato: '<',
		model: '=',
		ifLabel: '=?',
		servicio: '<?',
		recurso: '<?',
	}
	
}

// Se agrega el componente al módulo pasado por parámetros
export class SelectorProfesionalAtiendeComponent {
	static init(ngModule: angular.IModule) {
		ngModule.component('saSelectorProfesionalAtiende', component);
	}
}