/**
* @author:         emansilla
* @description:    Auditora de indicaciones
* @type:           Component
**/
import * as angular from 'angular';
import { AuditoriaIndicacionesController } from './auditoriaIndicacionesController';
const AuditoriaIndicacionesTemplate = require('./auditoriaIndicacionesComponent.html');

const component : angular.IComponentOptions = {
    template: AuditoriaIndicacionesTemplate,
    controller: AuditoriaIndicacionesController,
    controllerAs: 'vm'
}

export class AuditoriaIndicacionesComponent {
    static init(ngModule: angular.IModule) {
        ngModule.component('saAuditoriaIndicaciones', component);
    }
}