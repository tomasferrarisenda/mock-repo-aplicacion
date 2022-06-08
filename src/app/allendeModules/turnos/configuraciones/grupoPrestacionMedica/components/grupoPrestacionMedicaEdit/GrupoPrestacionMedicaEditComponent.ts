/**
* @author: pferrer
* @description: Componente del Edit
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { GrupoPrestacionMedicaEditController } from './GrupoPrestacionMedicaEditController';
const GrupoPrestacionMedicaEditTemplate = require('./GrupoPrestacionMedicaEditComponent.html');

// Unimos controller y template en el componente
const component: angular.IComponentOptions = {
    template: GrupoPrestacionMedicaEditTemplate,
    controller: GrupoPrestacionMedicaEditController,
    controllerAs: 'vm',
    bindings: {
        resolve:'<',
        close:'&',
        dismiss:'&'
    }
}

// Se agrega el componente al módulo pasado por parámetros
export class GrupoPrestacionMedicaEditComponent {
    static init(ngModule: angular.IModule) {
        ngModule.component('saGrupoPrestacionMedicaEdit', component);
    }
}