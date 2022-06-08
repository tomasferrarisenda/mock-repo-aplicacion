/**
* @author: pferrer
* @description: lalala
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { SelectorEntidadController } from './SelectorEntidadController';
const SelectorEntidadTemplate = require('./SelectorEntidadComponent.html');

// Unimos controller y template en el componente
const component: angular.IComponentOptions = {
    template: SelectorEntidadTemplate,
    controller: SelectorEntidadController,
    controllerAs: 'vm',
    bindings: {
		resolve: '<',
		close: '&',
		dismiss: '&'
	}
}

// Se agrega el componente al módulo pasado por parámetros
export class SelectorEntidadComponent {
    static init(ngModule: angular.IModule) {
        ngModule.component('saSelectorEntidad', component);
    }
}