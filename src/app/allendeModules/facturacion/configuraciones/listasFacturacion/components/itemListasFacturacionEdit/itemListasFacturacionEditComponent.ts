/**
* @author: rbassi
* @description: item lista facturacion edit
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { itemListasFacturacionEditController } from './itemListasFacturacionEditController';
const itemListasFacturacionEditTemplate = require('./itemListasFacturacionEditComponent.html');

// Unimos controller y template en el componente
const component : angular.IComponentOptions = {
 template: itemListasFacturacionEditTemplate,
 controller: itemListasFacturacionEditController,
 controllerAs: 'vm',
	bindings: {
		resolve: '<',
		close: '&',
		dismiss: '&'
	}
}

// Se agrega el componente al módulo pasado por parámetros
export class itemListasFacturacionEditComponent {
 static init(ngModule: angular.IModule) {
 ngModule.component('saitemListasFacturacionEdit', component);
 }
}	