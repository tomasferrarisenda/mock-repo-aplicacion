/**
* @author: rbassi
* @description: listas Facturacion Edit
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { listasFacturacionEditController } from './listasFacturacionEditController';
const listasFacturacionEditTemplate = require('./listasFacturacionEditComponent.html');

// Unimos controller y template en el componente
const component: angular.IComponentOptions = {
	template: listasFacturacionEditTemplate,
	controller: listasFacturacionEditController,
	controllerAs: 'vm',
}

// Se agrega el componente al módulo pasado por parámetros
export class listasFacturacionEditComponent {
	static init(ngModule: angular.IModule) {
		ngModule.component('saListasFacturacionEdit', component);
	}
}