/**
* @author: ppautasso
* @description: componente para mostrar reporte de profesionales prestadores
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { ReporteProfesionalesPrestadoresController } from './ReporteProfesionalesPrestadoresController';
const ReporteProfesionalesPrestadoresTemplate = require('./ReporteProfesionalesPrestadoresComponent.html');

// Unimos controller y template en el componente
const component: angular.IComponentOptions = {
	template: ReporteProfesionalesPrestadoresTemplate,
	controller: ReporteProfesionalesPrestadoresController,
	controllerAs: 'vm'
}

// Se agrega el componente al módulo pasado por parámetros
export class ReporteProfesionalesPrestadoresComponent {
	static init(ngModule: angular.IModule) {
		ngModule.component('saReporteProfesionalesPrestadores', component);
	}
}