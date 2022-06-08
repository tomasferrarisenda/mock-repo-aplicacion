import * as angular from 'angular';
import { RecepcionTurnosController } from "./RecepcionTurnosController";
const recepcionTurnosTemplate = require("./recepcionTurnos.html");

const component: angular.IComponentOptions = {
    template: recepcionTurnosTemplate,
    controller: RecepcionTurnosController,
    controllerAs: 'vm'
}

export class RecepcionTurnosComponent{
    static init(ngModule: angular.IModule) {
        ngModule.component('saRecepcionTurnos', component);
    }
}