/**
 * @author 			ppautasso
 * @description 	states para consultorioMedico Home
 */
import * as angular from 'angular';

const states = [
	{
		name: 'consultorioMedico',
		url: '/ConsultorioMedico',
		parent: 'signed',
		template: '<ui-view><sa-loading></sa-loading></ui-view>'
	},
	{
		name: 'consultorioMedico.agenda',
		url: '/AgendaMedica',
		template: '<sa-consultorio-medico-agenda-list><sa-loading></sa-loading></sa-consultorio-medico-agenda-list>',
		data: {
			idPermiso: 293,
			module: 'CONSULTORIO MEDICO - AGENDA'
		}
	},
    {
        name: 'consultorioMedico.asignar',
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
            idPermiso: 299,
            module: 'ASIGNACION DE TURNOS - MEDICO'
        }
    }
]


export class ConsultorioMedicoHomeStates {
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