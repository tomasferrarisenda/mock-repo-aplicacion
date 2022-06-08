/**
* @author: pf
* @description: lala
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { ListadoDocumentosPrintController } from './ListadoDocumentosPrintController';
const ListadoDocumentosPrintTemplate = require('./ListadoDocumentosPrint.html');

// Unimos controller y template en el componente
const component: angular.IComponentOptions = {
    template: ListadoDocumentosPrintTemplate,
    controller: ListadoDocumentosPrintController,
    controllerAs: 'vm',
    bindings: {
		resolve: '<',
		close: '&',
		dismiss: '&'
	}
}

// Se agrega el componente al módulo pasado por parámetros
export class ListadoDocumentosPrintComponent {
    static init(ngModule: angular.IModule) {
        ngModule.component('saListadoDocumentosPrint', component);
    }
}