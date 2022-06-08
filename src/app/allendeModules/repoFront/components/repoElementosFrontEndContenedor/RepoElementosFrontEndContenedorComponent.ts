/**
* @author: ppautasso
* @description: componente para repo general de elementos de frontend
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { RepoElementosFrontEndContenedorController } from './RepoElementosFrontEndContenedorController';
const RepoElementosFrontEndContenedorTemplate = require('./RepoElementosFrontEndContenedorComponent.html');

// Unimos controller y template en el componente
const component: angular.IComponentOptions = {
	template: RepoElementosFrontEndContenedorTemplate,
	controller: RepoElementosFrontEndContenedorController,
	controllerAs: 'vm'
}

// Se agrega el componente al módulo pasado por parámetros
export class RepoElementosFrontEndContenedorComponent {
	static init(ngModule: angular.IModule) {
		ngModule.component('saRepoElementosFrontEndContenedor', component);
	}
}