/**
* @author: ppautasso
* @description: componente tipo table para mostrar las indicaciones medicas de enfermeria
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { IndicacionesMedicasEnfermeriaTableController } from './IndicacionesMedicasEnfermeriaTableController';
const IndicacionesMedicasEnfermeriaTableTemplate = require('./IndicacionesMedicasEnfermeriaTableComponent.html');

// Unimos controller y template en el componente
const component: angular.IComponentOptions = {
	template: IndicacionesMedicasEnfermeriaTableTemplate,
	controller: IndicacionesMedicasEnfermeriaTableController,
	controllerAs: 'vm',
	bindings:{
        data: '<',
		titulogrid: '@?',
		loading: '=?',
		internado: '<',
		imprimirZebraClick: '&?',
		colocarSueroClick: '&?',
		suministrarClick: '&?',
		verSuerosCargadosClick: '&?' 
    }
}

// Se agrega el componente al módulo pasado por parámetros
export class IndicacionesMedicasEnfermeriaTableComponent {
	static init(ngModule: angular.IModule) {
		ngModule.component('saIndicacionesMedicasEnfermeriaTable', component);
	}
}