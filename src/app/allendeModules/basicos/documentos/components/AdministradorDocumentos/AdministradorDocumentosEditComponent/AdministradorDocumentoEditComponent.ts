/**
* @author: pferrer
* @description: 
* @type: Component
**/
import * as angular from 'angular';
import { AdministradorDocumentoEditController } from './AdministradorDocumentoEditController';
const AministradorDocumentoEditTemplate = require('./AdministradorDocumentoEditComponent.html');

const component: angular.IComponentOptions = {
	template: AministradorDocumentoEditTemplate,
	controller: AdministradorDocumentoEditController,
	controllerAs: 'vm',
	bindings: {
		resolve: '<',
		close: '&',
		dismiss: '&'
	}
}

export class AdministradorDocumentoEditComponent {
	static componentName = 'saAdministradorDocumentoEdit';

	static init(ngModule: angular.IModule) {
		ngModule.component(this.componentName, component);
	}
}