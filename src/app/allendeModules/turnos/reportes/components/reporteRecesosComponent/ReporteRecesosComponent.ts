/**
* @author: ppautasso
* @description: componente para reporte de recesos
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { ReporteRecesosController } from './ReporteRecesosController';
const ReporteRecesosTemplate = require('./ReporteRecesosComponent.html');

// Unimos controller y template en el componente
const component: angular.IComponentOptions = {
	template: ReporteRecesosTemplate,
	controller: ReporteRecesosController,
	controllerAs: 'vm'
}

// Se agrega el componente al módulo pasado por parámetros
export class ReporteRecesosComponent {
	static init(ngModule: angular.IModule) {
		ngModule.component('saReporteRecesos', component);
	}
}