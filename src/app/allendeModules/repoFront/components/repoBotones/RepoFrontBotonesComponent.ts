/**
* @author: pablopautasso
* @description: componente para repo de botones dentro de repofrontend
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { RepoFrontBotonesController } from './RepoFrontBotonesController';
const RepoFrontBotonesTemplate = require('./RepoFrontBotonesComponent.html');

// Unimos controller y template en el componente
const component: angular.IComponentOptions = {
	template: RepoFrontBotonesTemplate,
	controller: RepoFrontBotonesController,
	controllerAs: 'vm',
	bindings:{
		codeHtml: '=?'
	}
}

// Se agrega el componente al módulo pasado por parámetros
export class RepoFrontBotonesComponent {
	static init(ngModule: angular.IModule) {
		ngModule.component('saRepoFrontBotones', component);
	}
}