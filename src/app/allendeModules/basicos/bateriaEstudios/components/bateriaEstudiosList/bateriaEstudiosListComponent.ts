/**
* @author: crusso
* @description: Bateria Estudios List Component
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { bateriaEstudiosListController } from './bateriaEstudiosListController';
const bateriaEstudiosListTemplate = require('./bateriaEstudiosListComponent.html');

// Unimos controller y template en el componente
const component: angular.IComponentOptions = {
    template: bateriaEstudiosListTemplate,
    controller: bateriaEstudiosListController,
    controllerAs: 'vm'
}

// Se agrega el componente al módulo pasado por parámetros
export class bateriaEstudiosListComponent {
    static init(ngModule: angular.IModule) {
        ngModule.component('saBateriaEstudiosList', component);
    }
}

