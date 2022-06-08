/**
* @author:         emansilla
* @description:    Lista de cuentas
* @type:           Component
**/
import * as angular from 'angular';
import { FacturacionCuentaListController } from './FacturacionCuentaListController';
const FacturacionCuentasListTemplate = require('./FacturacionCuentaListComponent.html');

const component : angular.IComponentOptions = {
	template: FacturacionCuentasListTemplate,
	controller: FacturacionCuentaListController,
	controllerAs: 'vm'
}

export class FacturacionCuentaListComponent {
	static init(ngModule: angular.IModule) {
		ngModule.component('saFacturacionCuentaList', component); 
	}
}