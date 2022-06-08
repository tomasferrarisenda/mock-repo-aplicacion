/**
* @author: Aldo Minoldo						
* @description: Componente del Edit
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { UnidadesArancelariasEditController } from './UnidadesArancelariasEditController';
const UnidadesArancelariasEditTemplate = require('./UnidadesArancelariasEditComponent.html');

// Unimos controller y template en el componente
const component: angular.IComponentOptions = {
	template: UnidadesArancelariasEditTemplate,
	controller: UnidadesArancelariasEditController,
	controllerAs: 'vm',
	bindings: {
		resolve: '<',
		close: '&',
		dismiss: '&'
	}
}

// Se agrega el componente al módulo pasado por parámetros
export class UnidadesArancelariasEditComponent {
	static init(ngModule: angular.IModule) {
		ngModule.component('saUnidadesArancelariasEdit', component);
	}
}