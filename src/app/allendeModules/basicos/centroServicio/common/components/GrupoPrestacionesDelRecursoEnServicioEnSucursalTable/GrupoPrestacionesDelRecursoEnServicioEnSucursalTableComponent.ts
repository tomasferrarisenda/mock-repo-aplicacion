/**
* @author: ppautasso
* @description: componente para mostrar los grupos de prestaciones de un recurso de un servicio en una sucursal
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { GrupoPrestacionesDelRecursoEnServicioEnSucursalTableController } from './GrupoPrestacionesDelRecursoEnServicioEnSucursalTableController';
const GrupoPrestacionesDelRecursoEnServicioEnSucursalTableTemplate = require('./GrupoPrestacionesDelRecursoEnServicioEnSucursalTableComponent.html');

// Unimos controller y template en el componente
const component: angular.IComponentOptions = {
	template: GrupoPrestacionesDelRecursoEnServicioEnSucursalTableTemplate,
	controller: GrupoPrestacionesDelRecursoEnServicioEnSucursalTableController,
	controllerAs: 'vm',
	bindings: {
		servicio: '<',
		loading: '=?',
		sucursal: '<',
		recurso: '<'
	}
}

// Se agrega el componente al módulo pasado por parámetros
export class GrupoPrestacionesDelRecursoEnServicioEnSucursalTableComponent {
	static init(ngModule: angular.IModule) {
		ngModule.component('saGrupoPrestacionesDelRecursoEnServicioEnSucursalTable', component);
	}
}