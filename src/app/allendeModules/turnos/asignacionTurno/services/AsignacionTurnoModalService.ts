/**
 * @author:			Pablo Pautasso
 * @description:	Logic service para Asignacion turnos
 * @type:			Service
 **/

import asignacionTurnoNuevoView = require('../templates/asignacion-turno-nuevo.tpl.html');
import asignacionTurnoNuevoVariosPacientesView = require('../templates/asignacion-turnos-varios-pacientes.tpl.html');
import RequerimientosMasPreparacionesView = require('../templates/requerimientos-preparaciones.tpl.html');

import * as angular from 'angular';

export default (function () {
   'use strict';
   

	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('AsignacionTurnoModalService', AsignacionTurnoModalService);

		AsignacionTurnoModalService.$inject = ['Logger', '$uibModal', 'DateUtils','moment'];
		
		function AsignacionTurnoModalService($log, $uibModal, DateUtils, moment) {

			$log = $log.getInstance('AsignacionTurnoModalService');

			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			var _turnosDuracion: any = [];
			var _turnosDuracionDelDia;

			const service = {
				openAsignarTurno : openAsignarTurno, //OK
				openAsignarTurnoVariosPacientes : openAsignarTurnoVariosPacientes, //OK
				openRequerimientosMasPreparaciones: openRequerimientosMasPreparaciones, //OK
				openListaDeTurnosGenerados: openListaDeTurnosGenerados, //OK
				openSolicitudesEstudios: openSolicitudesEstudios
			};

			return service;

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

	

			function openAsignarTurno (pTurno, pCriterioBusqueda, pPacientes, pRecurso, pServicio, pSucursal,
				pTipoTurno, pPrestaciones, pIdTurnoAReprogramar, pObservacionesPorSucursal) {

				return $uibModal.open({
					template: asignacionTurnoNuevoView,
					controller: 'AsignacionTurnoNuevoController',
					controllerAs: 'vm',
					size: 'lg',
					resolve: {
						 CriterioBusqueda: function () {
						 	return pCriterioBusqueda;	
						 }, 
						 Turno: function () {
						 	return pTurno;	
						 },
						Paciente: function () {
							return pPacientes;
						},
						Title: function() {
							return 'Otorgar Turno';
						},
						Recurso: function () {
							return pRecurso;
						},
						Servicio: function () {
							return pServicio;
						},
						Sucursal: function() {
							return pSucursal;
						},
						TipoTurno: function() {
							return pTipoTurno;
						},
						Prestaciones: function() {
							return pPrestaciones;
						},
						IdTurnoReprogramar: function () {
							return pIdTurnoAReprogramar;
						},
						ObservacionesPorSucursal: function () {
							return pObservacionesPorSucursal;
						}
					}

				}).result;

			}

			function openAsignarTurnoVariosPacientes(pTurnosPorPaciente, pCriterioBusquedaList, pPacientes) {
				return $uibModal.open({
					template: asignacionTurnoNuevoVariosPacientesView,
					controller: 'AsignacionTurnosVariosPacienteController',
					controllerAs: 'vm',
					keyboard: true,
					size: 'lg',
					resolve: {
						TurnosPorPaciente : function () {
							return pTurnosPorPaciente;
						},
						CriterioBusquedaList: function name() {
							return pCriterioBusquedaList;
						},
						Pacientes: function () {
							return pPacientes;
						}
					}
				}).result;				
			}

			function openRequerimientosMasPreparaciones(dataTurnos, turnos, criterioBusqueda) {
				return $uibModal.open({
					template: RequerimientosMasPreparacionesView,
					controller: 'RequerimientosPreparacionesController',
					controllerAs: 'vm',
					keyboard: true,
					size: 'lg',
					resolve: {
						DataTurnos : function () {
							return dataTurnos;
						},
						Turnos : function () {
							return turnos
						},
						CriterioBusqueda: function () {
							return criterioBusqueda;
						}
					}
				}).result;				
			}
	
			function openListaDeTurnosGenerados(criterioBusquedaFecha, paciente, fecha, tipoConsulta) {
				return $uibModal.open({
					component: 'saListaTurnosGeneradosXRecursoComponent',
					size: 'lg',
					keyboard: true,
					resolve: {
						CriterioBusqueda: function () {
							return criterioBusquedaFecha;
						},
						Paciente: function () {
							return paciente;
						}, 
						Fecha: function () {
							return fecha;
						},
						TipoConsulta: function () {
							return tipoConsulta;
						}
					}
				}).result;
			}

			
			function openSolicitudesEstudios(solicitudes, paciente) {
				return $uibModal.open({
					component: 'saSeleccionarSolicitudEstudiosModalComponent',
					size: 'lg',
					keyboard: true,
					resolve: {
						Solicitudes: function () {
							return solicitudes;
						},
						Paciente: function () {
							return paciente;
						}
					}
				}).result;
			}
			
		}
	};

	return module;
})();