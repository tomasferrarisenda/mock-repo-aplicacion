/**
* @author: ppautasso
* @description: Componente contenedor de piso selector y sector selector
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { PisoSectorContenedorController } from './PisoSectorContenedorController';
const PisoSectorContenedorTemplate = require('./PisoSectorContenedorComponent.html');

// Unimos controller y template en el componente
const component: angular.IComponentOptions = {
	template: PisoSectorContenedorTemplate,
	controller: PisoSectorContenedorController,
	controllerAs: 'vm',
	bindings: {
		sucursal: '<',
		piso: '=',
		sector: '=',
		deposito: '=',
		loading: '=?',
		mostrarDeposito: '=?'
	}
}

// Se agrega el componente al módulo pasado por parámetros
export class PisoSectorContenedorComponent {
	static init(ngModule: angular.IModule) {
		ngModule.component('saPisoSectorContenedor', component);
	}
}