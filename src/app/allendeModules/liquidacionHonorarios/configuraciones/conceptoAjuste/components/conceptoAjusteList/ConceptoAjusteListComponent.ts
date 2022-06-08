/**
* @author:         emansilla
* @description:    Lista de conceptos ajustes para contratos internos
* @type:           Component
**/
import * as angular from 'angular';
import { ConceptoAjusteListController } from './ConceptoAjusteListController';
const ConceptoAjusteListTemplate = require('./ConceptoAjusteListComponent.html');

const component : angular.IComponentOptions = {
	template: ConceptoAjusteListTemplate,
	controller: ConceptoAjusteListController,
	controllerAs: 'vm'
}

export class ConceptoAjusteListComponent {
	static init(ngModule: angular.IModule) {
		ngModule.component('saConceptoAjusteList', component);
	}
}