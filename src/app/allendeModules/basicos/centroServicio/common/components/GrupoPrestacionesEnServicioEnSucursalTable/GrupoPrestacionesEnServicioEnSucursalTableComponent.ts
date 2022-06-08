/**
* @author: ppautasso
* @description: componente para grupo de prestaciones en servicio en sucursal table
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { GrupoPrestacionesEnServicioEnSucursalTableController } from './GrupoPrestacionesEnServicioEnSucursalTableController';
const GrupoPrestacionesEnServicioEnSucursalTableTemplate = require('./GrupoPrestacionesEnServicioEnSucursalTableComponent.html');

// Unimos controller y template en el componente
const component: angular.IComponentOptions = {
	template: GrupoPrestacionesEnServicioEnSucursalTableTemplate,
	controller: GrupoPrestacionesEnServicioEnSucursalTableController,
	controllerAs: 'vm',
	bindings: {
		servicio: '<',
		loading: '=?',
		sucursal: '<',
	}
}

// Se agrega el componente al módulo pasado por parámetros
export class GrupoPrestacionesEnServicioEnSucursalTableComponent {
	static init(ngModule: angular.IModule) {
		ngModule.component('saGrupoPrestacionesEnServicioEnSucursalTable', component);
	}
}