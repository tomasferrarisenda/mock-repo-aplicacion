/**
 * @author:			Pablo Pautasso
 * @description:	Service data para asignacion turno
 * @type:			Service
 **/
export interface IAsignacionTurnoDataService {
	obtenerPrimerTurnoAsignable(pCriterioDeBusqueda);
	obtenerTurnosDisponibles(pCriterioDeBusquedaConFecha);
	obtenerTurnosAsignablesDelDia(pFecha, pIdSucursal, pIdServicio, pIdTipoRecurso, pIdRecurso, pIdPacient, pIdTipoTurno, pIdPrestacion, pEdad, pSexo, pIdFinanciador);
	obtenerPrimerTurnoAsignableDeCadaRecursoDelServicio(pCriterioDeBusqueda);
	obtenerDisponibilidadDeSobreturnos(pCriterioDeBusquedaConFecha);
	obtenerDisponibilidadDeSobreturnosDeCadaRecursoDelServicio(pCriterioDeBusquedaCal);
	obtenerTurnosDisponiblesDeCadaRecursoDelServicio(pCriterioDeBusquedaCal);
	obtenerTurnosDisponiblesDeCadaRecursoDelServicioUnificado(pCriterioDeBusqueda);
	ObtenerTurnosDisponiblesDeCadaRecursoDelServicioParaPortal(pCriterioDeBusquedaCal);
	obtenerTodosSituacionGralDia();
	obtenerTurnosAsignablesVariosMedicosElMismoDia(pCriterioDeBusquedaLista);
	obtenerTurnosPorRecursoParaRecepcion(pIdRecurso, pIdTipoRecurso, pIdServicio, pIdSucursal, pFecha);
	obtenerNuevoDuracionDeTurno(pIdServicio, pIdRecurso, pIdTipoRecurso, pIdTipoDeTurno, pIdPrestacio, pEdadPaciente);
	obtenerTurnosPorRecurso(pIdServicio, pIdRecurso, pIdTipoRecurso, pFechaDesde, pFechaHasta, pSoloAgendaActiva): angular.IPromise<any>;
	obtenerNuevoCriterioBusquedaParaDuracionDto();
	obtenerDuracionNecesariaParaRecursoEnServicio(pCriterioDuracion);
	obtenerDuracionNecesariaParaServicio(pCriterioDuracion);
}

export default (function () {
   'use strict';
   


	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('AsignacionTurnoDataService', AsignacionTurnoDataService);

		AsignacionTurnoDataService.$inject = ['DotService', 'Logger'];
		
		function AsignacionTurnoDataService (DotService, $log) {

			$log = $log.getInstance('AsignacionTurnoDataService');

			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */
			

			const service = {
			

				obtenerPrimerTurnoAsignable : obtenerPrimerTurnoAsignable,
				obtenerTurnosDisponibles: obtenerTurnosDisponibles,
				obtenerTurnosAsignablesDelDia : obtenerTurnosAsignablesDelDia,
				obtenerPrimerTurnoCadaRecursoServicio : obtenerPrimerTurnoAsignableDeCadaRecursoDelServicio,

				obtenerDisponibilidadDeSobreturnos: obtenerDisponibilidadDeSobreturnos,
				obtenerDisponibilidadDeSobreturnosDeCadaRecursoDelServicio: obtenerDisponibilidadDeSobreturnosDeCadaRecursoDelServicio,

				obtenerTurnosCadaRecursoServicio : obtenerTurnosDisponiblesDeCadaRecursoDelServicio,
				obtenerTurnosDisponiblesDeCadaRecursoDelServicioUnificado: obtenerTurnosDisponiblesDeCadaRecursoDelServicioUnificado,
				ObtenerTurnosDisponiblesDeCadaRecursoDelServicioParaPortal : ObtenerTurnosDisponiblesDeCadaRecursoDelServicioParaPortal,

				obtenerTodosSituacionGralDia : obtenerTodosSituacionGralDia,

				obtenerTurnosAsignablesVariosMedicosElMismoDia : obtenerTurnosAsignablesVariosMedicosElMismoDia,
				obtenerTurnosPorRecursoParaRecepcion: obtenerTurnosPorRecursoParaRecepcion,

				//deprecated, reemplazado por obtenerDuracionNecesariaParaRecursoEnServicio o obtenerDuracionNecesariaParaServicio
				obtenerNuevoDuracionDeTurno : obtenerNuevoDuracionDeTurno,

				obtenerTurnosPorRecurso : obtenerTurnosPorRecurso,

				obtenerNuevoCriterioBusquedaParaDuracionDto : obtenerNuevoCriterioBusquedaParaDuracionDto,
				obtenerDuracionNecesariaParaRecursoEnServicio : obtenerDuracionNecesariaParaRecursoEnServicio,
				obtenerDuracionNecesariaParaServicio : obtenerDuracionNecesariaParaServicio


			};

			return service;

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			
	

			function obtenerPrimerTurnoAsignable(pCriterioDeBusqueda) {
				var _url = 'DisponibilidadDeTurnos/ObtenerPrimerTurnoAsignable';

				return DotService.Post(_url, pCriterioDeBusqueda);
			}

			function obtenerTurnosDisponibles(pCriterioDeBusquedaConFecha) {

				var _url = 'DisponibilidadDeTurnos/ObtenerTurnosDisponibles';
				return DotService.Post(_url, pCriterioDeBusquedaConFecha);
			}

			function obtenerTurnosAsignablesDelDia(pFecha,pIdSucursal,pIdServicio,pIdTipoRecurso,pIdRecurso,pIdPaciente,
				pIdTipoTurno,pIdPrestacion,pEdad,pSexo,pIdFinanciador) {

				var _url = 'DisponibilidadDeTurnos/ObtenerTurnosAsignablesDelDia/' + pFecha + '/' + pIdSucursal + '/' +
				pIdServicio + '/' + pIdTipoRecurso + '/' + pIdRecurso + '/' + pIdPaciente + '/' + pIdTipoTurno + '/' + 
				pIdPrestacion + '/' + pEdad + '/' + pSexo + '/' + pIdFinanciador;
				return DotService.Get(_url);
				
			}

			function obtenerDisponibilidadDeSobreturnos(pCriterioDeBusquedaFecha) {
				var _url = 'DisponibilidadDeTurnos/ObtenerDisponibilidadDeSobreturnos';
				return DotService.Post(_url, pCriterioDeBusquedaFecha);
			}

			function obtenerDisponibilidadDeSobreturnosDeCadaRecursoDelServicio(pCriterioDeBusquedaCal) {
				var _url = 'DisponibilidadDeTurnos/ObtenerDisponibilidadDeSobreturnosDeCadaRecursoDelServicio';
				return DotService.Post(_url, pCriterioDeBusquedaCal);
			}

			function obtenerPrimerTurnoAsignableDeCadaRecursoDelServicio(pCriterioDeBusqueda) {
				var _url = 'DisponibilidadDeTurnos/ObtenerPrimerTurnoAsignableDeCadaRecursoDelServicio';
				return DotService.Post(_url, pCriterioDeBusqueda);
			}

			function obtenerTurnosDisponiblesDeCadaRecursoDelServicio(pCriterioDeBusquedaCal) {
				var _url = 'DisponibilidadDeTurnos/ObtenerTurnosDisponiblesDeCadaRecursoDelServicio';
				return DotService.Post(_url, pCriterioDeBusquedaCal);
			}

			function obtenerTurnosDisponiblesDeCadaRecursoDelServicioUnificado(pCriterioDeBusqueda) {
				var _url = 'DisponibilidadDeTurnos/ObtenerTurnosDisponiblesDeCadaRecursoDelServicioUnificado';
				return DotService.Post(_url, pCriterioDeBusqueda);
			}

			function ObtenerTurnosDisponiblesDeCadaRecursoDelServicioParaPortal(pCriterioDeBusquedaCal) {
				var _url = 'DisponibilidadDeTurnos/ObtenerTurnosDisponiblesDeCadaRecursoDelServicioParaPortal';
				return DotService.Post(_url, pCriterioDeBusquedaCal);
			}
			


			function obtenerTodosSituacionGralDia() {
				var _url = 'DisponibilidadDeTurnos/SituacionGeneralDeDia/ObtenerTodos';
				return DotService.Get(_url);
			}


			function obtenerTurnosAsignablesVariosMedicosElMismoDia(pCriterioDeBusquedaLista) {
				var _url = 'DisponibilidadDeTurnos/ObtenerTurnosAsignablesVariosMedicosElMismoDia';
				return DotService.Post(_url, pCriterioDeBusquedaLista);
			}

			function obtenerTurnosPorRecursoParaRecepcion(pIdRecurso, pIdTipoRecurso, pIdServicio, pIdSucursal, pFecha, pMostrarCancelados) {
				var _url = 'DisponibilidadDeTurnos/ObtenerTurnosPorRecursoParaRecepcion/' + pIdRecurso + '/' + pIdTipoRecurso + '/' +
					pIdServicio + '/' + pIdSucursal + '/' + pFecha + '/' + pMostrarCancelados;
				return DotService.Get(_url);
			}

			//deprecated
			function obtenerNuevoDuracionDeTurno(pIdServicio, pIdRecurso, pIdTipoRecurso, pIdTipoDeTurno, pIdPrestacion,
				pEdadPaciente) {
				var _url = 'DuracionDeTurnos/ObtenerDuracion/' + pIdServicio + '/' + pIdRecurso + '/' + pIdTipoRecurso + 
				'/' + pIdTipoDeTurno + '/' + pIdPrestacion + '/' + pEdadPaciente;
				return DotService.Get(_url);
			}

			function obtenerTurnosPorRecurso(pIdServicio, pIdRecurso, pIdTipoRecurso, pFechaDesde, pFechaHasta, pSoloAgendaActiva) {
				var _url = 'DisponibilidadDeTurnos/ObtenerTurnosPorRecurso/' + pIdServicio + '/' + pIdRecurso + 
				'/'	+ pIdTipoRecurso + '/' + pFechaDesde + '/' + pFechaHasta + '/' + pSoloAgendaActiva;
				return DotService.Get(_url);
			}

			function obtenerNuevoCriterioBusquedaParaDuracionDto() {
				var _url = 'DuracionDeTurnos/ObtenerNuevoCriterioBusquedaParaDuracionDto/';
				return DotService.Get(_url);
			}

			function obtenerDuracionNecesariaParaRecursoEnServicio(pCriterioDuracion) {
				var _url = 'DuracionDeTurnos/ObtenerDuracionNecesariaParaRecursoEnServicio';
				return DotService.Post(_url, pCriterioDuracion);
			}

			function obtenerDuracionNecesariaParaServicio(pCriterioDuracion) {
				var _url = 'DuracionDeTurnos/ObtenerDuracionNecesariaParaServicio';
				return DotService.Post(_url, pCriterioDuracion);
			}

		}
	};

	return module;
})();