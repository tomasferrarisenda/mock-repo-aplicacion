/**
* @author: ppautasso
* @description: componente para mostrar los inputs del sistema
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { RepoFrontInputsController } from './RepoFrontInputsController';
const RepoFrontInputsTemplate = require('./RepoFrontInputsComponent.html');

// Unimos controller y template en el componente
const component: angular.IComponentOptions = {
	template: RepoFrontInputsTemplate,
	controller: RepoFrontInputsController,
	controllerAs: 'vm',
	bindings: {
		codeHtml: '=?'
	}
}

// Se agrega el componente al módulo pasado por parámetros
export class RepoFrontInputsComponent {
	static init(ngModule: angular.IModule) {
		ngModule.component('saRepoFrontInputs', component);
	}
}