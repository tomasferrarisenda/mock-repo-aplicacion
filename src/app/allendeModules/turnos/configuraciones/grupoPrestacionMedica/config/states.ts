/**
* @author: pferrer
* @description: Grupo Prestacion Medica
* @type: States
**/
import * as angular from 'angular';

const states = [
    {
        name: 'turno.configuraciones.grupoPrestacionMedica',
        url: '/GrupoPrestacionMedica',
        template: '<sa-grupo-prestacion-medica-list></sa-grupo-prestacion-medica-list>',
        data : {
			idPermiso: 271
		}
    }
];

const redirects = [
];

export class TurnoGrupoPrestacionMedicaStates {

    static init(ngModule: angular.IModule) {
        ngModule.config(statesConfig);

        statesConfig.$inject = ['$urlRouterProvider', '$stateProvider'];
        function statesConfig($urlRouterProvider, $stateProvider) {
            for (let i = 0; i < states.length; i++) {
                $stateProvider.state(states[i]);
            }
        }
    }
}