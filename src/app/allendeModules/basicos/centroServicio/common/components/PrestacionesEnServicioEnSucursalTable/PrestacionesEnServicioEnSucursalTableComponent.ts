/**
* @author: ppautasso
* @description: componente para prestacines en servicio en sucursal table
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { PrestacionesEnServicioEnSucursalTableController } from './PrestacionesEnServicioEnSucursalTableController';
const PrestacionesEnServicioEnSucursalTableTemplate = require('./PrestacionesEnServicioEnSucursalTableComponent.html');

// Unimos controller y template en el componente
const component: angular.IComponentOptions = {
	template: PrestacionesEnServicioEnSucursalTableTemplate,
	controller: PrestacionesEnServicioEnSucursalTableController,
	controllerAs: 'vm',
	bindings: {
		servicio: '<',
		loading: '=?',
		sucursal: '<',
		prestacionSelected: '=?',
		onRecursoSelected: '<',
	}
}

// Se agrega el componente al módulo pasado por parámetros
export class PrestacionesEnServicioEnSucursalTableComponent {
	static init(ngModule: angular.IModule) {
		ngModule.component('saPrestacionesEnServicioEnSucursalTable', component);
	}
}