/**
* @author: ppautasso
* @description: componente para el stock de piso de enfermeria
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { EnfermeriaStockPorPisoController } from './EnfermeriaStockPorPisoController';
const EnfermeriaStockPorPisoTemplate = require('./EnfermeriaStockPorPisoComponent.html');

// Unimos controller y template en el componente
const component: angular.IComponentOptions = {
	template: EnfermeriaStockPorPisoTemplate,
	controller: EnfermeriaStockPorPisoController,
	controllerAs: 'vm'
}

// Se agrega el componente al módulo pasado por parámetros
export class EnfermeriaStockPorPisoComponent {
	static init(ngModule: angular.IModule) {
		ngModule.component('saEnfermeriaStockPorPiso', component);
	}
}