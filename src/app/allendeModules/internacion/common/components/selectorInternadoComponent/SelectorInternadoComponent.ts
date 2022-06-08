/**
* @author: ppautasso
* @description: Componente para seleccionar internado
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { SelectorInternadoController } from './SelectorInternadoController';
const SelectorInternadoTemplate = require('./SelectorInternadoComponent.html');

// Unimos controller y template en el componente
const component: angular.IComponentOptions = {
	template: SelectorInternadoTemplate,
	controller: SelectorInternadoController,
	controllerAs: 'vm',
	bindings: {
		internado: '=?',
		numeroInternado: '=?',
		cols: '<?'
    }
}

// Se agrega el componente al módulo pasado por parámetros
export class SelectorInternadoComponent {
	static init(ngModule: angular.IModule) {
		ngModule.component('saSelectorInternado', component);
	}
}