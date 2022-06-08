/**
* @author: ppautasso
* @description: Componente para el reporte de los turnos del dia por profesional
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { ReporteTurnosDelDiaProfesionalController } from './ReporteTurnosDelDiaProfesionalController';
const ReporteTurnosDelDiaProfesionalTemplate = require('./ReporteTurnosDelDiaProfesionalComponent.html');

// Unimos controller y template en el componente
const component: angular.IComponentOptions = {
	template: ReporteTurnosDelDiaProfesionalTemplate,
	controller: ReporteTurnosDelDiaProfesionalController,
	controllerAs: 'vm',
	bindings: {
		resolve: '<',	// por ser Modal. An object of the modal resolve values
		close: '&',		// por ser Modal. A method that can be used to close a modal, passing a result. 
		// 	Use: {$value: myResult}
		dismiss: '&',	// por ser Modal. A method that can be used to dismiss a modal, passing a result.
		// 	Use: {$value: myRejectedResult}

	},
}

// Se agrega el componente al módulo pasado por parámetros
export class ReporteTurnosDelDiaProfesionalComponent {
	static init(ngModule: angular.IModule) {
		ngModule.component('saReporteTurnosDelDiaProfesional', component);
	}
}