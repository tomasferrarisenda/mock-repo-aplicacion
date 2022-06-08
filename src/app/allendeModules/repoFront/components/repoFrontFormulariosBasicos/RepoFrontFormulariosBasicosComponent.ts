/**
* @author: ppautasso
* @description: componente para mostrar formularios basicos de front
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { RepoFrontFormulariosBasicosController } from './RepoFrontFormulariosBasicosController';
const RepoFrontFormulariosBasicosTemplate = require('./RepoFrontFormulariosBasicosComponent.html');

// Unimos controller y template en el componente
const component: angular.IComponentOptions = {
	template: RepoFrontFormulariosBasicosTemplate,
	controller: RepoFrontFormulariosBasicosController,
	controllerAs: 'vm',
	bindings: {
		codeHtml: '=?'
	}
}

// Se agrega el componente al módulo pasado por parámetros
export class RepoFrontFormulariosBasicosComponent {
	static init(ngModule: angular.IModule) {
		ngModule.component('saRepoFrontFormulariosBasicos', component);
	}
}