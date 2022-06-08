/**
* @author: pablopautasso
* @description: Componente para lista de turnos generados x recurso
* @type: Component
**/
import * as angular from 'angular';
import { ListaTurnosGeneradosXRecursoController } from './ListaTurnosGeneradosXRecursoController';
const ListaTurnosGeneradosXRecursoTemplate = require('../ListaTurnosGeneradosXRecursoComponent/lista-turnos-generados-recurso.tpl.html');

const component: angular.IComponentOptions = {
    template: ListaTurnosGeneradosXRecursoTemplate,
    bindings: {
        resolve: '<',	// por ser Modal. An object of the modal resolve values
        close: '&',		// por ser Modal. A method that can be used to close a modal, passing a result. 
        // 	Use: {$value: myResult}
        dismiss: '&',	// por ser Modal. A method that can be used to dismiss a modal, passing a result.
        // 	Use: {$value: myRejectedResult}

    },
    controller: ListaTurnosGeneradosXRecursoController,
    controllerAs: 'vm'
}

export class ListaTurnosGeneradosXRecursoComponent {
    static init(ngModule: angular.IModule) {
        ngModule.component('saListaTurnosGeneradosXRecursoComponent', component);
    }
}