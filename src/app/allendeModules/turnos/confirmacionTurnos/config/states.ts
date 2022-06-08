/**
* @author:         emansilla
* @description:    Estados de informes de turno
* @type:           States
**/
import * as angular from 'angular';


const states = [
	{
		name: 'turno.confirmacionDeTurnos',
		url: '/ConfirmacionDeTurnos',
		template: '<ui-view><sa-loading></sa-loading></ui-view>'
	},
	{
		name: 'turno.confirmacionDeTurnos.programaciones',
		url: '/Programaciones',
		template: '<sa-confirmacion-turnos-programaciones-list><sa-loading></sa-loading></sa-confirmacion-turnos-programaciones-list>',
		data: {
			idPermiso: 286,
			module: 'CONFIRMACION DE TURNOS - PROGRAMACIONES'
		}
	},
	{
		name: 'turno.confirmacionDeTurnos.logEjecuciones',
		url: '/LogsEjecuciones',
		template: '<sa-confirmacion-turnos-logs-ejecuciones-list><sa-loading></sa-loading></sa-confirmacion-turnos-logs-ejecuciones-list>',
		data: {
			idPermiso: 287,
			module: 'CONFIRMACION DE TURNOS - LOGS DE EJECUCIONES'
		}
	},
	{
		name: 'turno.confirmacionDeTurnos.resultadosDeConfirmacion',
		url: '/ResultadosDeConfirmacion',
		template: '<sa-confirmacion-turnos-resultados-confirmacion-list><sa-loading></sa-loading></sa-confirmacion-turnos-resultados-confirmacion-list>',
		data: {
			idPermiso: 290,
			module: 'CONFIRMACION DE TURNOS - RESULTADOS DE CONFIRMACION'
		}
	},
	{
		name: 'turno.confirmacionDeTurnos.listadoDeComunicaciones',
		url: '/ListadoDeComunicaciones',
		template: '<sa-confirmacion-turnos-listado-comunicaciones-list><sa-loading></sa-loading></sa-confirmacion-turnos-listado-comunicaciones-list>',
		data: {
			idPermiso: 291,
			module: 'CONFIRMACION DE TURNOS - LISTADO COMUNICACIONES'
		}
	}
];

const redirects = [
	{ from: '/Turno/ConfirmacionDeTurnos', to: '/Turno/ConfirmacionDeTurnos/Listado' }
]

export class TurnoConfirmacionStates {

	static init(ngModule: angular.IModule) {
		ngModule.config(statesConfig);
		
		statesConfig.$inject = ['$urlRouterProvider', '$stateProvider'];
		function statesConfig($urlRouterProvider, $stateProvider) {
			
			for (let i = 0; i < redirects.length; i++) {
				$urlRouterProvider.when(redirects[i].from, redirects[i].to);
			}

			for (let i = 0; i < states.length; i++) {
				$stateProvider.state(states[i]);
			}
		}
	}
}