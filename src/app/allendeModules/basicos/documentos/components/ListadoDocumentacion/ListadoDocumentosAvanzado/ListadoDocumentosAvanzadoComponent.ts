/**
* @author: pfe
* @description: lala
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { ListadoDocumentosAvanzadoController } from './ListadoDocumentosAvanzadoController';
const ListadoDocumentosAvanzadoTemplate = require('./ListadoDocumentosAvanzado.html');

// Unimos controller y template en el componente
const component: angular.IComponentOptions = {
    template: ListadoDocumentosAvanzadoTemplate,
    controller: ListadoDocumentosAvanzadoController,
    controllerAs: 'vm',
    bindings: {
        model: '=',
        entidadGlobal : '<',
        entidadLocal : '<',
        buscarPagina: '&?'
    }
}

// Se agrega el componente al módulo pasado por parámetros
export class ListadoDocumentosAvanzadoComponent {
    static init(ngModule: angular.IModule) {
        ngModule.component('saListadoDocumentosAvanzado', component);
    }
}