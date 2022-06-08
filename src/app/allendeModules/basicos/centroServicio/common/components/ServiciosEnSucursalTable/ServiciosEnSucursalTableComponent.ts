/**
* @author: ppautasso
* @description: componente para servicios en sucursal table
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { ServiciosEnSucursalTableController } from './ServiciosEnSucursalTableController';
const ServiciosEnSucursalTableTemplate = require('./ServiciosEnSucursalTableComponent.html');

// Unimos controller y template en el componente
const component: angular.IComponentOptions = {
	template: ServiciosEnSucursalTableTemplate,
	controller: ServiciosEnSucursalTableController,
	controllerAs: 'vm',
	bindings:{
		sucursal: '<',
		serviciosEnSucursal: '=',
		loading: '=?',
		servicioSeleccionado: '=?'
	}
}

// Se agrega el componente al módulo pasado por parámetros
export class ServiciosEnSucursalTableComponent {
	static init(ngModule: angular.IModule) {
		ngModule.component('saServiciosEnSucursalTable', component);
	}
}