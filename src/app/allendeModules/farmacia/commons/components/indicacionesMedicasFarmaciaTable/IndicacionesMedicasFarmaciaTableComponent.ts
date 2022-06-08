/**
* @author: ppautasso
* @description: componente tipo table para mostrar indicaciones medicas por internado para farmacia
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { IndicacionesMedicasFarmaciaTableController } from './IndicacionesMedicasFarmaciaTableController';
const IndicacionesMedicasFarmaciaTableTemplate = require('./IndicacionesMedicasFarmaciaTableComponent.html');

// Unimos controller y template en el componente
const component: angular.IComponentOptions = {
	template: IndicacionesMedicasFarmaciaTableTemplate,
	controller: IndicacionesMedicasFarmaciaTableController,
	controllerAs: 'vm',
	bindings:{
        data: '<',
		titulogrid: '@?',
		loading: '=?',
		internado: '<',
		facturarDevolverIf: '<',
		prepararIndicacionClick: '&?',
		cambiarProductoClick: '&?',
		cambiarProductoAgregadoClick: '&?',
		asignarProductoClick: '&?',
		desasignarProductoClick: '&?',
		eliminarDescartableClick: '&?',
    }
}

// Se agrega el componente al módulo pasado por parámetros
export class IndicacionesMedicasFarmaciaTableComponent {
	static init(ngModule: angular.IModule) {
		ngModule.component('saIndicacionesMedicasFarmaciaTable', component);
	}
}