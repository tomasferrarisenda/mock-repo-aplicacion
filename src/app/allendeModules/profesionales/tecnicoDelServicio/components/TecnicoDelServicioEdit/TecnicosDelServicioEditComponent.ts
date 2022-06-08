/**
* @author: crusso
* @description: Editar Controller
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { TecnicosDelServicioEditController } from './TecnicosDelServicioEditController';
const TecnicosDelServicioEditTemplate = require('./TecnicosDelServicioEditComponent.html');

// Unimos controller y template en el componente
const component: angular.IComponentOptions = {
	template: TecnicosDelServicioEditTemplate,
	controller: TecnicosDelServicioEditController,
	controllerAs: 'vm',
	bindings: {
		resolve: '<',
		close: '&',
		dismiss: '&'
	}
}

// Se agrega el componente al módulo pasado por parámetros
export class TecnicosDelServicioEditComponent {
	static componentName = 'saTecnicosDelServicioEdit';

	static init(ngModule: angular.IModule) {
		ngModule.component(this.componentName, component);
	}
}