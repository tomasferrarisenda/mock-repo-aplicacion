/**
* @author:         @emansilla
* @description:    Setea el token y el usuario y busca la información de seguridad
* @type:           Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { LoginOkController } from './LoginOkController';
const LoginOkTemplate = require('./LoginOkComponent.html');

// Unimos controller y template en el componente
const component : angular.IComponentOptions = {
	template: LoginOkTemplate,
	controller: LoginOkController,
	controllerAs: 'vm'
}

// Se agrega el componente al módulo pasado por parámetros
export class LoginOkComponent {
	static init(ngModule: angular.IModule) {
		ngModule.component('saLoginOk', component);
	}
}