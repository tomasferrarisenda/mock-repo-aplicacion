/**
* @author: ppautasso
* @description: componente para repo de front contendor de colores y clases
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { RepoFrontColoresClasesController } from './RepoFrontColoresClasesController';
const RepoFrontColoresClasesTemplate = require('./RepoFrontColoresClasesComponent.html');

// Unimos controller y template en el componente
const component: angular.IComponentOptions = {
	template: RepoFrontColoresClasesTemplate,
	controller: RepoFrontColoresClasesController,
	controllerAs: 'vm',
	bindings: {
		codeHtml: '=?'
	}
}

// Se agrega el componente al módulo pasado por parámetros
export class RepoFrontColoresClasesComponent {
	static init(ngModule: angular.IModule) {
		ngModule.component('saRepoFrontColoresClases', component);
	}
}