/**
* @author: ppautasso
* @description: componente para selector de producto
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { SelectorProductoController } from './SelectorProductoController';
const SelectorProductoTemplate = require('./SelectorProductoComponent.html');

// Unimos controller y template en el componente
const component: angular.IComponentOptions = {
    template: SelectorProductoTemplate,
    controller: SelectorProductoController,
    controllerAs: 'vm',
    bindings: {
        stockeable: '='
    }
}

// Se agrega el componente al módulo pasado por parámetros
export class SelectorProductoComponent {
    static init(ngModule: angular.IModule) {
        ngModule.component('saSelectorProducto', component);
    }
}