/**
* @author: ppautasso
* @description: componente para repo front de alertas
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { RepoFrontAlertasController } from './RepoFrontAlertasController';
const RepoFrontAlertasTemplate = require('./RepoFrontAlertasComponent.html');

// Unimos controller y template en el componente
const component : angular.IComponentOptions = {
 template: RepoFrontAlertasTemplate,
 controller: RepoFrontAlertasController,
 controllerAs: 'vm',
	bindings: {
		codeHtml: '=?'
	}
}

// Se agrega el componente al módulo pasado por parámetros
export class RepoFrontAlertasComponent {
 static init(ngModule: angular.IModule) {
 ngModule.component('saRepoFrontAlertas', component);
 }
}