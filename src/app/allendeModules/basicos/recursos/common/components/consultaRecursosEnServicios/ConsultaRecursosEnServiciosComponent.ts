/**
* @author: ppautasso
* @description: componente para la consulta de recursos en servicios
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { ConsultaRecursosEnServiciosController } from './ConsultaRecursosEnServiciosController';
const ConsultaRecursosEnServiciosTemplate = require('./ConsultaRecursosEnServiciosComponent.html');

// Unimos controller y template en el componente
const component: angular.IComponentOptions = {
    template: ConsultaRecursosEnServiciosTemplate,
    controller: ConsultaRecursosEnServiciosController,
    controllerAs: 'vm',
    bindings: {
        resolve: '<', // por ser Modal. An object of the modal resolve values
        close: '&', // por ser Modal. A method that can be used to close a modal, passing a result. 
        // 	Use: {$value: myResult}
        dismiss: '&', // por ser Modal. A method that can be used to dismiss a modal, passing a result.
				// 	Use: {$value: myRejectedResult}
    }
}

// Se agrega el componente al módulo pasado por parámetros
export class ConsultaRecursosEnServiciosComponent {
    static init(ngModule: angular.IModule) {
        ngModule.component('saConsultaRecursosEnServicios', component);
    }
}