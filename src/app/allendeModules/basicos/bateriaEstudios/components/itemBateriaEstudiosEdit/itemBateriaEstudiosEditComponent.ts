/**
* @author: Crusso
* @description: Bateria Estudios Edit Item
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { itemBateriaEstudiosEditController } from './itemBateriaEstudiosEditController';
const itemBateriaEstudiosEditTemplate = require('./itemBateriaEstudiosEditComponent.html');

// Unimos controller y template en el componente
const component: angular.IComponentOptions = {
    template: itemBateriaEstudiosEditTemplate,
    controller: itemBateriaEstudiosEditController,
    controllerAs: 'vm',
    bindings: {
        resolve: '<',
        close: '&',
        dismiss: '&'
    }
}

// Se agrega el componente al módulo pasado por parámetros
export class itemBateriaEstudiosEditComponent {
    static componentName = 'saItemBateriaEstudiosEdit';
    static init(ngModule: angular.IModule) {
        ngModule.component(this.componentName, component);
    }
}