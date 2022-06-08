/**
* @author: ppautasso
* @description: componente para levantar modal para buscar exahustivamente internado
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { BuscadorInternadoModalController } from './BuscadorInternadoModalController';
const BuscadorInternadoModalTemplate = require('./BuscadorInternadoModalComponent.html');

// Unimos controller y template en el componente
const component: angular.IComponentOptions = {
	template: BuscadorInternadoModalTemplate,
	controller: BuscadorInternadoModalController,
	controllerAs: 'vm',
	bindings: {
        resolve: '<', // por ser Modal. An object of the modal resolve values
        close: '&', // por ser Modal. A method that can be used to close a modal, passing a result. 
        // 	Use: {$value: myResult}
        dismiss: '&', // por ser Modal. A method that can be used to dismiss a modal, passing a result.
				// 	Use: {$value: myRejectedResult}
    }
}

// Se agrega el componente al módulo pasado por parámetros
export class BuscadorInternadoModalComponent {
	static init(ngModule: angular.IModule) {
		ngModule.component('saBuscadorInternadoModal', component);
	}
}