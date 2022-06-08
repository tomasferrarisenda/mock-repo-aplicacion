/**
* @author:         emansilla
* @description:    Estados de informes de turno
* @type:           States
**/
import * as angular from 'angular';
import turnosListView = require('../../listaTurnos/views/turnos-list.html');

const states = [
	{
		name: 'turno.reportes',
		url: '/Reportes',
		template: '<ui-view><sa-loading></sa-loading></ui-view>'
	},
	{
		name: 'turno.reportes.primerosTurnos',
		url: '/ListadoPrimerosTurnos',
		template: '<sa-reporte-primeros-turnos><sa-loading></sa-loading></sa-reporte-primeros-turnos>',
		data: {
			idPermiso: 240,
			module: 'REPORTE PRIMEROS TURNOS'
		}
	},
	{
		name: 'turno.reportes.turnosDelDia',
		url: '/ListadoTurnosDelDia',
		template: turnosListView,
		controller: 'TurnosListController',
		controllerAs: 'vm',
		data: {
			idPermiso: 208,
			module: 'LISTA DE TURNOS DEL DIA'
		}
	},
	{
		name: 'turno.reportes.reporteGenericoDeTurnos',
		url: '/ReporteGenericoTurnos',
		template: '<sa-reporte-generico-turnos><sa-loading></sa-loading></sa-reporte-generico-turnos>',
		data: {
			idPermiso: 259,
			module: 'REPORTE GENERICO TURNOS'
		}
	},
	{
		name: 'turno.reportes.reporteRecesos',
		url: '/ReporteRecesos',
		template: '<sa-reporte-recesos><sa-loading></sa-loading></sa-reporte-recesos>',
		data: {
			idPermiso: 274,
			module: 'REPORTE RECESOS'
		}
	},
	{
		name: 'turno.reportes.reporteProfesionalesPrestadores',
		url: '/ReporteProfesionalesPrestadores',
		template: '<sa-reporte-profesionales-prestadores><sa-loading></sa-loading></sa-reporte-profesionales-prestadores>',
		data: {
			idPermiso: 301,
			module: 'REPORTE PROFESIONALES PRESTADORES'
		}
	}
];

const redirects = [
	{ from: '/Turno/Reportes', to: '/Turno/Reportes/Listado' }
]

export class TurnoReportesStates {

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