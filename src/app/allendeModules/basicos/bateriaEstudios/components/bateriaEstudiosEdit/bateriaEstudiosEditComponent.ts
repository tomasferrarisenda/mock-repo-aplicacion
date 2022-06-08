/**
* @author: crusso
* @description: Bateria Estudios Edit Component
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { bateriaEstudiosEditController } from './bateriaEstudiosEditController';
const bateriaEstudiosEditTemplate = require('./bateriaEstudiosEditComponent.html');

// Unimos controller y template en el componente
const component: angular.IComponentOptions = {
    template: bateriaEstudiosEditTemplate,
    controller: bateriaEstudiosEditController,
    controllerAs: 'vm'
}

// Se agrega el componente al módulo pasado por parámetros
export class bateriaEstudiosEditComponent {
    static init(ngModule: angular.IModule) {
        ngModule.component('saBateriaEstudiosEdit', component);
    }
}