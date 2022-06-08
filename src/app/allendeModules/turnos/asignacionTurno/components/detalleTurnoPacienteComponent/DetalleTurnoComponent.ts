/**
* @author: ppautasso
* @description: 
* @type: Component
**/
import * as angular from 'angular';
import { DetalleTurnoController } from './DetalleTurnoController';
const DetalleTurnoTemplate = require('./DetalleTurnoComponent.html');

const component: angular.IComponentOptions = {
    template: DetalleTurnoTemplate,
    controller: DetalleTurnoController,
    controllerAs: 'vm',
    bindings: {
        pacienteConTurnos: '=?'
    }
}

export class DetalleTurnoComponent {
    static init(ngModule: angular.IModule) {
        ngModule.component('saDetalleTurno', component);
    }
}