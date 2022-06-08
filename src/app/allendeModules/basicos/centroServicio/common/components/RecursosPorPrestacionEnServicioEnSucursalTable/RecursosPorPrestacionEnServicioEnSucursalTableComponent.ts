/**
* @author: ppautasso
* @description: componente para mostrar recursos por prestacion en servicio en sucursal table
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { RecursosPorPrestacionEnServicioEnSucursalTableController } from './RecursosPorPrestacionEnServicioEnSucursalTableController';
const RecursosPorPrestacionEnServicioEnSucursalTableTemplate = require('./RecursosPorPrestacionEnServicioEnSucursalTableComponent.html');

// Unimos controller y template en el componente
const component: angular.IComponentOptions = {
	template: RecursosPorPrestacionEnServicioEnSucursalTableTemplate,
	controller: RecursosPorPrestacionEnServicioEnSucursalTableController,
	controllerAs: 'vm',
	bindings:{		
		loading: '=?',
		sucursal: '<?',
		servicio: '<?',
		prestacion: '<?',
	}
}

// Se agrega el componente al módulo pasado por parámetros
export class RecursosPorPrestacionEnServicioEnSucursalTableComponent {
	static init(ngModule: angular.IModule) {
		ngModule.component('saRecursosPorPrestacionEnServicioEnSucursalTable', component);
	}
}