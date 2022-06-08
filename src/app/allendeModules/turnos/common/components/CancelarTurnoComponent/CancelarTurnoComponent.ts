/**
* @author: ppautasso
* @description: Componente tipo modal para cancelar turnos en estadoa usente o asignado
* @type: Component
**/
import * as angular from 'angular';
// Importamos controller y template
import { CancelarTurnoController } from './CancelarTurnoController';
const CancelarTurnoTemplate = require('./CancelarTurnoComponent.html');

// Unimos controller y template en el componente
const component: angular.IComponentOptions = {
    template: CancelarTurnoTemplate,
    controller: CancelarTurnoController,
    controllerAs: 'vm',
    bindings: {
        resolve: '<',	// por ser Modal. An object of the modal resolve values
        close: '&',		// por ser Modal. A method that can be used to close a modal, passing a result. 
        // 	Use: {$value: myResult}
        dismiss: '&',	// por ser Modal. A method that can be used to dismiss a modal, passing a result.
        // 	Use: {$value: myRejectedResult}

    }
}

// Se agrega el componente al módulo pasado por parámetros
export class CancelarTurnoComponent {
    static init(ngModule: angular.IModule) {
        ngModule.component('saCancelarTurno', component);
    }
}