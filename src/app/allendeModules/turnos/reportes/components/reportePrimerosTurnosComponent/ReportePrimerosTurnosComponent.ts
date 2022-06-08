/**
* @author: pablo pautasso
* @description: Componente Para el reporte de los primeros turnos
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { ReportePrimerosTurnosController } from './ReportePrimerosTurnosController';
const ReportePrimerosTurnosTemplate = require('./ReportePrimerosTurnosComponent.html');

// Unimos controller y template en el componente
const component: angular.IComponentOptions = {
	template: ReportePrimerosTurnosTemplate,
	controller: ReportePrimerosTurnosController,
	controllerAs: 'vm'
}

// Se agrega el componente al módulo pasado por parámetros
export class ReportePrimerosTurnosComponent {
	static init(ngModule: angular.IModule) {
		ngModule.component('saReportePrimerosTurnos', component);
	}
}