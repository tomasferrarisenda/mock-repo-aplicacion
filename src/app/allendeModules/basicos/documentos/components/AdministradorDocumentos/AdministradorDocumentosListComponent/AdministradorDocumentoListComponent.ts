/**
* @author:         pferrer
* @description:    Lista de documentos
* @type:           Component
**/
import * as angular from 'angular';
import { AdministradorDocumentoListController } from './AdministradorDocumentoListController';
const AdministradorDocumentosTemplate = require('./AdministradorDocumentoListComponent.html');

const component : angular.IComponentOptions = {
	template: AdministradorDocumentosTemplate,
	controller: AdministradorDocumentoListController,
	controllerAs: 'vm'
}

export class AdministradorDocumentoListComponent {
	static init(ngModule: angular.IModule) {
		ngModule.component('saAdministradorDocumentoList', component);
	}
}