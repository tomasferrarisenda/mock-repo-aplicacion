/**
* @author: Carlos Russo
* @description: Cuenta Edit
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { FacturacionCuentaEditController } from './FacturacionCuentaEditController';
const FacturacionCuentasEditTemplate = require('./FacturacionCuentaEditComponent.html');

// Unimos controller y template en el componente - Modal de Editar
const component: angular.IComponentOptions = {
	template: FacturacionCuentasEditTemplate,
	controller: FacturacionCuentaEditController,
	controllerAs: 'vm',
	bindings: { 
		resolve: '<',
		close: '&',
		dismiss: '&'
	}
}

// Se agrega el componente al módulo pasado por parámetros
export class FacturacionCuentaEditComponent {
	static init(ngModule: angular.IModule) {
		ngModule.component('saFacturacionCuentaEdit', component);
	}
} 