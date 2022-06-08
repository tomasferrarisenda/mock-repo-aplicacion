/**
* @author: ppautasso
* @description: Componente para la busqueda de internado
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { BuscadorInternadoPorSectorController } from './BuscadorInternadoPorSectorController';
const BuscadorInternadoPorSectorTemplate = require('./BuscadorInternadoPorSectorComponent.html');

// Unimos controller y template en el componente
const component: angular.IComponentOptions = {
    template: BuscadorInternadoPorSectorTemplate,
    controller: BuscadorInternadoPorSectorController,
    controllerAs: 'vm',
    bindings:{
        internado: '=',
        loading: '=?',
        sector: '<',
        placeholder: '<?'
    }
}

// Se agrega el componente al módulo pasado por parámetros
export class BuscadorInternadoPorSectorComponent {
    static init(ngModule: angular.IModule) {
        ngModule.component('saBuscadorInternadoPorSector', component);
    }
}