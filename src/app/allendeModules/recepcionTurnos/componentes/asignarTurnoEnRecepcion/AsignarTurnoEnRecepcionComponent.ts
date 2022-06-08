import * as angular from 'angular';

import { AsignarTurnoEnRecepcionController } from "./AsignarTurnoEnRecepcionController";
const asignarTurnoEnRecepcionTemplate = require("./AsignarTurnoEnRecepcion.html");

const component: angular.IComponentOptions = {
    template: asignarTurnoEnRecepcionTemplate,
    controller: AsignarTurnoEnRecepcionController,
    controllerAs: 'vm'
}

export class AsignarTurnoEnRecepcionComponent {
    static init(ngModule: angular.IModule) {
        ngModule.component('saAsignarTurnoEnRecepcion', component);
    }
}