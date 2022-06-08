/**
* @author:         emansilla
* @description:    Listado de suministros
* @type:           Component
**/
import * as angular from 'angular';
import { IndicacionSuministradaListController } from './indicacionSuministradaListController';
const IndicacionSuministradaListTemplate = require('./indicacionSuministradaListComponent.html');

const component : angular.IComponentOptions = {
    template: IndicacionSuministradaListTemplate,
    bindings: {
        data: '<'
    },
    controller: IndicacionSuministradaListController,
    controllerAs: 'vm'
}

export class IndicacionSuministradaListComponent {
    static init(ngModule: angular.IModule) {
        ngModule.component('saIndicacionSuministradaList', component);
    }
}