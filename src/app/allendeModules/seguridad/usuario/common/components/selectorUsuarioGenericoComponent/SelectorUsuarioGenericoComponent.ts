/**
* @author: ppautasso
* @description: Componente para selector de usuario generico por metodo de busqueda
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { SelectorUsuarioGenericoController } from './SelectorUsuarioGenericoController';
const SelectorUsuarioGenericoTemplate = require('./SelectorUsuarioGenericoComponent.html');

// Unimos controller y template en el componente
const component: angular.IComponentOptions = {
    template: SelectorUsuarioGenericoTemplate,
    controller: SelectorUsuarioGenericoController,
    controllerAs: 'vm',
    bindings: {
        usuario: '<',
        loading: '=?',
        dataService: '<',
        method: '<',
        placeholder: '<?'
    }
}

// Se agrega el componente al módulo pasado por parámetros
export class SelectorUsuarioGenericoComponent {
    static init(ngModule: angular.IModule) {
        ngModule.component('saSelectorUsuarioGenerico', component);
    }
}