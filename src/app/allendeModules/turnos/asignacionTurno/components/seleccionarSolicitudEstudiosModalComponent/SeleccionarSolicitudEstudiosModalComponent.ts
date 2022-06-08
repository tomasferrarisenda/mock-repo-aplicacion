/**
* @author: pablopautasso
* @description: Componente para seleccionar solicitudes de estudio
* @type: Component
**/
import * as angular from 'angular';
import { SeleccionarSolicitudEstudiosModalController } from './SeleccionarSolicitudEstudiosModalController';
const SeleccionarSolicitudEstudiosModalTemplate = require('./SeleccionarSolicitudEstudiosModalComponent.html');

const component: angular.IComponentOptions = {
    template: SeleccionarSolicitudEstudiosModalTemplate,
    bindings: {
        resolve: '<',	// por ser Modal. An object of the modal resolve values
        close: '&',		// por ser Modal. A method that can be used to close a modal, passing a result. 
        // 	Use: {$value: myResult}
        dismiss: '&',	// por ser Modal. A method that can be used to dismiss a modal, passing a result.
        // 	Use: {$value: myRejectedResult}

    },
    controller: SeleccionarSolicitudEstudiosModalController,
    controllerAs: 'vm'
}

export class SeleccionarSolicitudEstudiosModalComponent {
    static init(ngModule: angular.IModule) {
        ngModule.component('saSeleccionarSolicitudEstudiosModalComponent', component);
    }
}