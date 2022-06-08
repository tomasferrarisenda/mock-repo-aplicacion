/**
* @author: crusso
* @description: Gestion Recepción Component
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { gestionRecepcionListController } from './gestionRecepcionListController';
const gestionRecepcionListTemplate = require('./gestionRecepcionListComponent.html');

// Unimos controller y template en el componente
const component: angular.IComponentOptions = {
    template: gestionRecepcionListTemplate,
    controller: gestionRecepcionListController,
    controllerAs: 'vm'
}

// Se agrega el componente al módulo pasado por parámetros
export class gestionRecepcionListComponent {
    static init(ngModule: angular.IModule) {
        ngModule.component('saGestionRecepcionList', component);
    }
}