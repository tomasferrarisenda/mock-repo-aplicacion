/**
* @author: aminoldo
* @description: Componente del Edit
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { RequisitosAdministrativosEditController } from './RequisitosAdministrativosEditController';
const RequisitosAdministrativosEditTemplate = require('./RequisitosAdministrativosEditComponent.html');

// Unimos controller y template en el componente
const component: angular.IComponentOptions = {
    template: RequisitosAdministrativosEditTemplate,
    controller: RequisitosAdministrativosEditController,
    controllerAs: 'vm',
    bindings: {
        resolve:'<',
        close:'&',
        dismiss:'&'
    }
}

// Se agrega el componente al módulo pasado por parámetros
export class RequisitosAdministrativosEditComponent {
    static init(ngModule: angular.IModule) {
        ngModule.component('saRequisitosAdministrativosEdit', component);
    }
}