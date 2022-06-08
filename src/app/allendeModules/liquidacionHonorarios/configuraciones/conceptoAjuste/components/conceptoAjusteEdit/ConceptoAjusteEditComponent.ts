/**
* @author: crusso
* @description: Concepto de Ajustes Edit
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { ConceptoAjusteEditController } from './ConceptoAjusteEditController';
const conceptoAjusteTemplate = require ("./ConceptoAjusteEdit.html");

// Unimos controller y template en el componente
const component: angular.IComponentOptions = {
    template: conceptoAjusteTemplate,
    controller: ConceptoAjusteEditController,
    controllerAs: 'vm',
    bindings: {
        resolve: '<',
        close: '&', 
        dismiss: '&'
    }
}

// Se agrega el componente al módulo pasado por parámetros
export class ConceptoAjusteEditComponent {
    static init(ngModule: angular.IModule) {
        ngModule.component('saConceptoAjusteEdit', component);
    }
}