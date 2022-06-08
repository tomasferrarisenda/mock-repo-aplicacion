/**
* @author: ppautasso
* @description: componente para selector 
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { SectorSelectorController } from './SectorSelectorController';
const SectorSelectorTemplate = require('./SectorSelectorComponent.html');

// Unimos controller y template en el componente
const component: angular.IComponentOptions = {
	template: SectorSelectorTemplate,
	controller: SectorSelectorController,
	controllerAs: 'vm',
	bindings:{
		sector: '=',
		piso: '<',
		loading: '=?'
	}
}

// Se agrega el componente al módulo pasado por parámetros
export class SectorSelectorComponent {
	static init(ngModule: angular.IModule) {
		ngModule.component('saSectorSelector', component);
	}
}