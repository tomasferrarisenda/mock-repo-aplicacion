/**
* @author: ppautasso
* @description: componente para prestaciones del recurso en servicio en sucursal table
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { PrestacionesDelRecursoEnServicioEnSucursalTableController } from './PrestacionesDelRecursoEnServicioEnSucursalTableController';
const PrestacionesDelRecursoEnServicioEnSucursalTableTemplate = require('./PrestacionesDelRecursoEnServicioEnSucursalTableComponent.html');

// Unimos controller y template en el componente
const component: angular.IComponentOptions = {
	template: PrestacionesDelRecursoEnServicioEnSucursalTableTemplate,
	controller: PrestacionesDelRecursoEnServicioEnSucursalTableController,
	controllerAs: 'vm',
	bindings: {
		sucursal: '<',
		servicio: '<',
		loading: '=?',
		recurso: '<'
	}
}

// Se agrega el componente al módulo pasado por parámetros
export class PrestacionesDelRecursoEnServicioEnSucursalTableComponent {
	static init(ngModule: angular.IModule) {
		ngModule.component('saPrestacionesDelRecursoEnServicioEnSucursalTable', component);
	}
}