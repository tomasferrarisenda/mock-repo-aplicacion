/**
* @author: crusso
* @description: Corte Facturacion
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { corteFacturacionListController } from './corteFacturacionListController';
const corteFacturacionListTemplate = require('./corteFacturacionListComponent.html');

// Unimos controller y template en el componente
const component: angular.IComponentOptions = {
    template: corteFacturacionListTemplate,
    controller: corteFacturacionListController,
    controllerAs: 'vm'
}

// Se agrega el componente al módulo pasado por parámetros
export class corteFacturacionListComponent {
    static init(ngModule: angular.IModule) {
        ngModule.component('saCorteFacturacionList', component);
    }
}