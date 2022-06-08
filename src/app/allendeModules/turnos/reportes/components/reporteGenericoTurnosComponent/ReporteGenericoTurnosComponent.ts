/**
* @author: ppautasso
* @description: Componente para el reporte generico de turnos
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { ReporteGenericoTurnosController } from './ReporteGenericoTurnosController';
const ReporteGenericoTurnosTemplate = require('./ReporteGenericoTurnosComponent.html');

// Unimos controller y template en el componente
const component: angular.IComponentOptions = {
    template: ReporteGenericoTurnosTemplate,
    controller: ReporteGenericoTurnosController,
    controllerAs: 'vm'
}

// Se agrega el componente al módulo pasado por parámetros
export class ReporteGenericoTurnosComponent {
    static init(ngModule: angular.IModule) {
        ngModule.component('saReporteGenericoTurnos', component);
    }
}