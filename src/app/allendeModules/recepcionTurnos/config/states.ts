/**
 * @author 			ppautasso
 * @description 	states para recepcion de turnos
 */
import * as angular from 'angular';

const states = [
    {
        name: 'recepcionturnos',
        url: '/RecepcionTurnos',
        parent: 'main.signed',
        template: '<ui-view><sa-loading></sa-loading></ui-view>'
    },
    {
        name: 'recepcionturnos.recepcion',
        url: '/Recepcion',
        template: '<sa-recepcion-turnos></sa-recepcion-turnos>',
        params: {
            enviarEfector: false
        },
        data: {
            idPermiso: 236,
            module: 'RECEPCION DE TURNOS'
        }
        
    },
    {
        name: 'recepcionturnos.asignar',
        url: '/Asignar',
        template: '<sa-asignar-turno-en-recepcion></sa-asignar-turno-en-recepcion>',
        params: {
            fecha: '',
            hora: '',
            idItemDePlantilla: 0,
            servicio: '',
            recurso: '',
            sucursal: ''
        },
        data: {
            idPermiso: 298,
            module: 'ASIGNACION DE TURNOS DESDE RECEPCION'
        }
    },
    {
        name: 'recepcionturnos.asignarSobreturnoDNP',
        url: '/AsignarDNP',
        template: '<sa-asignar-turno-en-recepcion></sa-asignar-turno-en-recepcion>',
        params: {
            fecha: '',
            servicio: '',
            recurso: '',
            sucursal: '',
            paciente: '',
            bloquesTurnos: ''
        },
        data: {
            idPermiso: 298,
            module: 'ASIGNACION DE TURNOS DNP'
        }
    }
]


export class RecepcionTurnosStates {
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