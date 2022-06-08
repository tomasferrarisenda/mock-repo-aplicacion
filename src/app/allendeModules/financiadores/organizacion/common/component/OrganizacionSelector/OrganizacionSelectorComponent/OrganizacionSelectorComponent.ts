/**
* @author: aminoldo
* @description: Buscador de organizaciones
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { OrganizacionSelectorController } from './OrganizacionSelectorController';
const OrganizacionSelectorTemplate = require('./OrganizacionSelectorComponent.html');

// Unimos controller y template en el componente
const component: angular.IComponentOptions = {
    template: OrganizacionSelectorTemplate,
    controller: OrganizacionSelectorController,
    controllerAs: 'vm',
    bindings: {
        model: '=',
        codigoOrganizacion: '<?'
    }
}

// Se agrega el componente al módulo pasado por parámetros
export class OrganizacionSelectorComponent {
    static init(ngModule: angular.IModule) {
        ngModule.component('saOrganizacionSelector', component);
    }
}