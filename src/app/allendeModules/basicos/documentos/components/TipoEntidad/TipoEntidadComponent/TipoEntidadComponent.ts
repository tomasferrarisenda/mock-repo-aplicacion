/**
* @author: pferrer
* @description: lalala
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { TipoEntidadController } from './TipoEntidadController';
const TipoEntidadTemplate = require('./TipoEntidadComponent.html');

// Unimos controller y template en el componente
const component: angular.IComponentOptions = {
    template: TipoEntidadTemplate,
    controller: TipoEntidadController,
    controllerAs: 'vm',
    bindings: {
        model: '=',
        editable: '<',
        idTipoEntidad: '=?'
    }
}

// Se agrega el componente al módulo pasado por parámetros
export class TipoEntidadComponent {
    static init(ngModule: angular.IModule) {
        ngModule.component('saTipoEntidad', component);
    }
}