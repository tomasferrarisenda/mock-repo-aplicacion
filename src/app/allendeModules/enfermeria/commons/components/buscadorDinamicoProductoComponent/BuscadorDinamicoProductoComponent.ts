/**
* @author: ppautasso
* @description: componente para buscador dinamico de producto
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { BuscadorDinamicoProductoController } from './BuscadorDinamicoProductoController';
const BuscadorDinamicoProductoTemplate = require('./BuscadorDinamicoProductoComponent.html');

// Unimos controller y template en el componente
const component: angular.IComponentOptions = {
	template: BuscadorDinamicoProductoTemplate,
	controller: BuscadorDinamicoProductoController,
	controllerAs: 'vm',
	bindings: {
		stockeable: '=',
		loading: '=?',
		borrarDatos: '=?'
    }
}

// Se agrega el componente al módulo pasado por parámetros
export class BuscadorDinamicoProductoComponent {
	static init(ngModule: angular.IModule) {
		ngModule.component('saBuscadorDinamicoProducto', component);
	}
}