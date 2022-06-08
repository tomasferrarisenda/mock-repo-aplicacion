/**
* @author: crusso
* @description: Edit Corte Facturacion Component
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { corteFacturacionEditController } from './corteFacturacionEditController';
const corteFacturacionEditTemplate = require('./corteFacturacionEditComponent.html');

// Unimos controller y template en el componente
const component: angular.IComponentOptions = {
    template: corteFacturacionEditTemplate,
    controller: corteFacturacionEditController,
    controllerAs: 'vm',
    bindings: {
        resolve: '<',
        close: '&',
        dismiss: '&'
    }
}

// Se agrega el componente al módulo pasado por parámetros
export class corteFacturacionEditComponent {
    static init(ngModule: angular.IModule) {
        ngModule.component('saCorteFacturacionEdit', component);
    }
}