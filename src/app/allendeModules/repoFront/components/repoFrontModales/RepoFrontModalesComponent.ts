/**
* @author: ppautasso
* @description: componente para el repo de modales
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { RepoFrontModalesController } from './RepoFrontModalesController';
const RepoFrontModalesTemplate = require('./RepoFrontModalesComponent.html');

// Unimos controller y template en el componente
const component: angular.IComponentOptions = {
	template: RepoFrontModalesTemplate,
	controller: RepoFrontModalesController,
	controllerAs: 'vm',
	bindings: {
		codeHtml: '=?'
	}
}

// Se agrega el componente al módulo pasado por parámetros
export class RepoFrontModalesComponent {
	static init(ngModule: angular.IModule) {
		ngModule.component('saRepoFrontModales', component);
	}
}