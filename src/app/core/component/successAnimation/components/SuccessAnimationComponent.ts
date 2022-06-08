/**
* @author: ppautasso
* @description: comppnente para success animation
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { SuccessAnimationController } from './SuccessAnimationController';
import './SuccessAnimation.scss';
const SuccessAnimationTemplate = require('./SuccessAnimationComponent.html');


// Unimos controller y template en el componente
const component: angular.IComponentOptions = {
	template: SuccessAnimationTemplate,
	controller: SuccessAnimationController,
	controllerAs: 'vm',
	bindings: {
		mensaje: '@?',
	}
}

// Se agrega el componente al módulo pasado por parámetros
export class SuccessAnimationComponent {
	static init(ngModule: angular.IModule) {
		ngModule.component('saSuccessAnimation', component);
	}
}