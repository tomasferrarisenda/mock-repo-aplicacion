/**
* @author: ppautasso
* @description: componente para recursos en servicio en sucursal table
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { RecursosEnServicioEnSucursalTableController } from './RecursosEnServicioEnSucursalTableController';
const RecursosEnServicioEnSucursalTableTemplate = require('./RecursosEnServicioEnSucursalTableComponent.html');

// Unimos controller y template en el componente
const component: angular.IComponentOptions = {
	template: RecursosEnServicioEnSucursalTableTemplate,
	controller: RecursosEnServicioEnSucursalTableController,
	controllerAs: 'vm',
	bindings:{
		servicio: '<',
		loading: '=?',
		sucursal: '<',
		recursoSeleccionado: '=?',
		onPrestacionSelected: '<',
		idJefeServicio: '<?'
	}
}

// Se agrega el componente al módulo pasado por parámetros
export class RecursosEnServicioEnSucursalTableComponent {
	static init(ngModule: angular.IModule) {
		ngModule.component('saRecursosEnServicioEnSucursalTable', component);
	}
}