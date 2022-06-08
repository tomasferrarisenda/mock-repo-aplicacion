/**
* @author: ppautasso
* @description: Componente para deposito selector
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { DepositoSelectorController } from './DepositoSelectorController';
const DepositoSelectorTemplate = require('./DepositoSelectorComponent.html');

// Unimos controller y template en el componente
const component: angular.IComponentOptions = {
    template: DepositoSelectorTemplate,
    controller: DepositoSelectorController,
    controllerAs: 'vm',
    bindings: {
        deposito: '=',
        sector: '<',
        loading: '=?'
    }
}

// Se agrega el componente al módulo pasado por parámetros
export class DepositoSelectorComponent {
    static init(ngModule: angular.IModule) {
        ngModule.component('saDepositoSelector', component);
    }
}