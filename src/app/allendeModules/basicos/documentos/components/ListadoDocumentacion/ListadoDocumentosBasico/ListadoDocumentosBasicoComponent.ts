/**
* @author: pfe
* @description: lala
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { ListadoDocumentosBasicoController } from './ListadoDocumentosBasicoController';
const ListadoDocumentosBasicoTemplate = require('./ListadoDocumentosBasico.html');

// Unimos controller y template en el componente
const component: angular.IComponentOptions = {
    template: ListadoDocumentosBasicoTemplate,
    controller: ListadoDocumentosBasicoController,
    controllerAs: 'vm',
    bindings: {
        model: '=',
        url: '<',
		data: '<',
		botonSubir: '<',
        fileExtensions: '<',
        idTipoEntidadContenedoraDocumentos : '<',
        idEntidadContenedoraDocumentos : '<'

    }
}

// Se agrega el componente al módulo pasado por parámetros
export class ListadoDocumentosBasicoComponent {
    static init(ngModule: angular.IModule) {
        ngModule.component('saListadoDocumentosBasico', component);
    }
}