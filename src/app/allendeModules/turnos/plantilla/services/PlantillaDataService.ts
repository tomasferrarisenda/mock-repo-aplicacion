/**
 * @author:			Pablo Pautasso
 * @description:	
 * @type:			Service
 **/
export default (function () {
   'use strict';
   


	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('PlantillaDataService', PlantillaDataService);

		PlantillaDataService.$inject = ['DotService', 'Logger'];
		
		function PlantillaDataService (DotService, $log) {

			$log = $log.getInstance('PlantillaDataService');

			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */
			/* jshint ignore: start*/
			var id;
			/* jshint ignore: end*/

			const service = {

				obtenerNuevaPlantilla : obtenerNuevaPlantilla,
				GetAll : GetAll,
				GetOne: GetOne,
				getOneConDetallePrestaciones:getOneConDetallePrestaciones,
				Add : Add,
				Update : Update,
				New : New,
				obtenerNuevoItemDePlantillaTurno : obtenerNuevoItemDePlantillaTurno,
				obtenerTiposDeTurnos: obtenerTiposDeTurnos,
				obtenerTiposDeTurnosSeleccionablesPorServicio: obtenerTiposDeTurnosSeleccionablesPorServicio,
				obtenerTiposDePrestacionesAsignables : obtenerTiposDePrestacionesAsignables,

				obtenerEnRangoDeFecha: obtenerEnRangoDeFecha,

				validarGuardar : validarGuardar,
				guardar : guardar,

				validarAplicarPlantilla: validarAplicarPlantilla,
				aplicarPlantilla: aplicarPlantilla,

				validarEliminarPlantilla: validarEliminarPlantilla,
				eliminarPlantilla: eliminarPlantilla,

				obtenerNuevoDuracionTurno : obtenerNuevoDuracionTurno,
				obtenerDuracionesPorServicioEnRecurso: obtenerDuracionesPorServicioEnRecurso,				
				validarGuardarDuracionTurno : validarGuardarDuracionTurno,
				guardarDuracionTurno : guardarDuracionTurno,
				obtenerDuracionTurnoPorId : obtenerDuracionTurnoPorId,
				validarEliminarDuracion : validarEliminarDuracion,
				eliminarDuracion : eliminarDuracion,

				obtenerPlantillasConObservacionesPorServicioRecurso : obtenerPlantillasConObservacionesPorServicioRecurso,
				obtenerPlantillasConObservacionesPorServicioRecursoConEstado: obtenerPlantillasConObservacionesPorServicioRecursoConEstado,
				obtenerPlantillasConObservacionesPorServicio : obtenerPlantillasConObservacionesPorServicio,
				obtenerPlantillasConObservacionesPorServicioConEstado: obtenerPlantillasConObservacionesPorServicioConEstado,
				

				obtenerNuevaRegla : obtenerNuevaRegla,
				validarGuardarRegla : validarGuardarRegla,
				guardarRegla : guardarRegla,
				obtenerReglasPorServicioEnRecurso: obtenerReglasPorServicioEnRecurso,
				obtenerReglasPorServicioRecursoConEliminadas: obtenerReglasPorServicioRecursoConEliminadas,
				obtenerReglaPorId : obtenerReglaPorId,
				validarEliminarRegla: validarEliminarRegla,
				eliminarRegla: eliminarRegla,
				obtenerAuditoriaPorReglaId: obtenerAuditoriaPorReglaId,
				sincronizarReglas: sincronizarReglas,

				crearCopiaDePlantilla : crearCopiaDePlantilla,
				ObtenerSemanaDeTurnosPorGenerarParaGrilla: ObtenerSemanaDeTurnosPorGenerarParaGrilla,
				obtenerSemanaDeTurnosPorGenerarExportarExcel: obtenerSemanaDeTurnosPorGenerarExportarExcel,
				obtenerSemanaDeTurnosPorGenerarExportarPdf: obtenerSemanaDeTurnosPorGenerarExportarPdf,

				actualizarObservacionesInternasPlantilla: actualizarObservacionesInternasPlantilla,
				actualizarObservacionesPortalPlantilla: actualizarObservacionesPortalPlantilla,

				exportarExcel: exportarExcel,
				exportarPdf: exportarPdf,

				ObtenerTodosDeUnServicioEnSucursal: ObtenerTodosDeUnServicioEnSucursal,
				obtenerAuditoriaPlantillaDeTurnosPorId: obtenerAuditoriaPlantillaDeTurnosPorId,
				obtenerAuditoriaReglasDuracionesDeTurnos: obtenerAuditoriaReglasDuracionesDeTurnos
			};

			return service;

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			function obtenerNuevaPlantilla() {
				var _url = 'PlantillasDeTurnos/ObtenerNuevo';
				return DotService.Get(_url);
			}

			function GetAll () {
				var _url = 'Estado/';
				return DotService.Get(_url);
			}

			function GetOne (pPlantillaId) {
				var _url = 'PlantillasDeTurnos/ObtenerPorId/' + pPlantillaId;
				return DotService.Get(_url);
			}

			function getOneConDetallePrestaciones (pPlantillaId, pPrestacionesConDetalle) {
				var _url = 'PlantillasDeTurnos/ObtenerPorId/' + pPlantillaId + '/' + pPrestacionesConDetalle;
				return DotService.Get(_url);
			}

			function Add (pData) {
				var _url = 'Estado/';
				return DotService.Post(_url, pData);
			}

			function Update (pData) {
				var _url = 'Estado/';
				return DotService.Put(_url, pData);
			}
			
			function New () {
				var _url = 'Estado/New';
				return DotService.Get(_url);
			}

			function obtenerNuevoItemDePlantillaTurno() {
				var _url = 'PlantillasDeTurnos/ObtenerNuevoItemDePlantillaTurno';
				return DotService.Get(_url);
			}

			function obtenerTiposDeTurnos() {
				var _url = 'TiposDeTurnos/ObtenerTodos';
				return DotService.Get(_url,{ isCachable: true });
			}

			function obtenerTiposDeTurnosSeleccionablesPorServicio(pIdServicio) {
				var _url = 'TiposDeTurnos/ObtenerSeleccionables/' + pIdServicio;
				return DotService.Get(_url);
			}


			function obtenerTiposDePrestacionesAsignables() {
				var _url = 'TiposDePrestacionesAsignables/ObtenerTodos';
				return DotService.Get(_url, { isCachable: true });
			}


			function obtenerEnRangoDeFecha(pIdServicio,pIdTipoRecurso,pIdRecurso,pFechaDesde,pFechaHasta,pEstadosBuscados) {
				var _url = 'PlantillasDeTurnos/ObtenerEnRangoDeFecha' + '/' + pIdServicio + 
				'/' + pIdTipoRecurso + '/' + pIdRecurso + '/' + pFechaDesde + '/' +
				pFechaHasta + '/' + pEstadosBuscados;

				return DotService.Get(_url);
			}

			function validarGuardar(pPlantilla) {
				var _url = 'PlantillasDeTurnos/ValidarGuardar';
				return DotService.Post(_url, pPlantilla);
			}

			function guardar(pPlantilla) {
				var _url = 'PlantillasDeTurnos/Guardar';
				return DotService.Post(_url, pPlantilla);
			}

			function validarAplicarPlantilla(pIdPlantilla) {
				var _url = 'PlantillasDeTurnos/ValidarAplicar/' + pIdPlantilla;
				return DotService.Get(_url);
			}

			function aplicarPlantilla(pIdPlantilla) {
				var _url = 'PlantillasDeTurnos/Aplicar/' + pIdPlantilla;
				return DotService.Get(_url);
			}

			function validarEliminarPlantilla(pIdPlantilla) {
				var _url = 'PlantillasDeTurnos/ValidarEliminar/' + pIdPlantilla;
				return DotService.Get(_url);
			}

			function eliminarPlantilla(pIdPlantilla) {
				var _url = 'PlantillasDeTurnos/Eliminar/' + pIdPlantilla;
				return DotService.Get(_url);
			}

			function obtenerNuevoDuracionTurno() {
				var _url = 'DuracionDeTurnos/ObtenerNuevo';
				return DotService.Get(_url);
			}

			function obtenerDuracionesPorServicioEnRecurso(pIdServicio,pIdRecurso,pIdTipoRecurso) {
				var _url = 'DuracionDeTurnos/ObtenerPorServicioRecurso/' + pIdServicio + '/' + pIdRecurso + 
				'/' + pIdTipoRecurso;
				return DotService.Get(_url);
			}
			
			function validarGuardarDuracionTurno(duracionTurno) {
				var _url = 'DuracionDeTurnos/ValidarGuardar';
				return DotService.Post(_url, duracionTurno);
			}

			function guardarDuracionTurno(duracionTurno) {
				var _url = 'DuracionDeTurnos/Guardar';
				return DotService.Post(_url, duracionTurno);
			}

			function obtenerDuracionTurnoPorId(pIdDuracionTurno) {
				var _url = 'DuracionDeTurnos/ObtenerPorId/' + pIdDuracionTurno;
				return DotService.Get(_url);
			}


			function validarEliminarDuracion(pIdDuracion) {
				var _url = 'DuracionDeTurnos/ValidarEliminar/' + pIdDuracion;
				return DotService.Get(_url);
			}

			function eliminarDuracion(pIdDuracion) {
				var _url = 'DuracionDeTurnos/Eliminar/' + pIdDuracion;
				return DotService.Get(_url);
			}

			function obtenerPlantillasConObservacionesPorServicioRecurso(pIdServicio, pIdTipoRecurso, 
				pIdRecurso, pFechaDesde, pFechaHasta) {
				var _url = 'PlantillasDeTurnos/ObtenerPlantillasConObservacionesPorServicioRecurso/' + pIdServicio + 
				'/' + pIdTipoRecurso + '/' + pIdRecurso + '/' + pFechaDesde + '/' + pFechaHasta;
				return DotService.Get(_url);
			}

			function obtenerPlantillasConObservacionesPorServicioRecursoConEstado(pIdServicio, pIdTipoRecurso, 
				pIdRecurso, pFechaDesde, pFechaHasta, pIdEstadoPlantillaTurno) {
					var _url = 'PlantillasDeTurnos/ObtenerPlantillasConObservacionesPorServicioRecurso/' + pIdServicio + 
					'/' + pIdTipoRecurso + '/' + pIdRecurso + '/' + pFechaDesde + '/' + pFechaHasta + '/' + pIdEstadoPlantillaTurno;
					return DotService.Get(_url);
			} 

			function obtenerPlantillasConObservacionesPorServicio(pIdServicio, pFechaDesde, pFechaHasta) {
				var _url = 'PlantillasDeTurnos/ObtenerPlantillasConObservacionesPorServicio/' + pIdServicio + '/' +
				pFechaDesde + '/' + pFechaHasta;
				return DotService.Get(_url);
			}

			function obtenerPlantillasConObservacionesPorServicioConEstado(pIdServicio, pFechaDesde, pFechaHasta, pIdEstadoPlantillaTurno) {
				var _url = 'PlantillasDeTurnos/ObtenerPlantillasConObservacionesPorServicio/' + pIdServicio + '/' +
				pFechaDesde + '/' + pFechaHasta + '/' + pIdEstadoPlantillaTurno;
				return DotService.Get(_url);
			}

			function obtenerNuevaRegla() {
				var _url = 'ReglasDeCantidadesDeTurnos/ObtenerNuevo';
				return DotService.Get(_url);
			}

			function validarGuardarRegla(regla) {
				var _url = 'ReglasDeCantidadesDeTurnos/ValidarGuardar';
				return DotService.Post(_url, regla);
			}

			function guardarRegla(regla) {
				var _url = 'ReglasDeCantidadesDeTurnos/Guardar';
				return DotService.Post(_url, regla);
			}

		
			function obtenerReglasPorServicioEnRecurso(pIdServicio, pIdRecurso, pIdTipoRecurso, pIdTipoDemanda) {
				var _url = 'ReglasDeCantidadesDeTurnos/ObtenerPorServicioRecurso/' + pIdServicio + '/' + pIdRecurso + 
				'/' + pIdTipoRecurso + '/' + pIdTipoDemanda;
				return DotService.Get(_url);
			}

			function obtenerReglaPorId(pIdRegla) {
				var _url = 'ReglasDeCantidadesDeTurnos/ObtenerPorId/' + pIdRegla;
				return DotService.Get(_url);
			}

			function validarEliminarRegla(pIdRegla) {
				var _url = 'ReglasDeCantidadesDeTurnos/ValidarEliminar/' + pIdRegla;
				return DotService.Get(_url);
			}

			function eliminarRegla(pIdRegla) {
				var _url = 'ReglasDeCantidadesDeTurnos/Eliminar/' + pIdRegla;
				return DotService.Get(_url);
			}

			function obtenerAuditoriaPorReglaId(pIdRegla) {
				var _url = 'ReglasDeCantidadesDeTurnos/ObtenerAuditoria/' + pIdRegla;
				return DotService.Get(_url);
			}

			function obtenerReglasPorServicioRecursoConEliminadas(pIdServicio, pIdRecurso, pIdTipoRecurso, pIdTipoDemanda) {
				var _url = 'ReglasDeCantidadesDeTurnos/ObtenerReglasPorServicioRecursoConEliminadas/' + pIdServicio + '/' + pIdRecurso + '/' + pIdTipoRecurso + '/' + pIdTipoDemanda;
				return DotService.Get(_url);
			}

			function sincronizarReglas(pIdServicio, pIdRecurso, pIdTipoRecurso, pOrigen, pDestino) {
				var _url = 'ReglasDeCantidadesDeTurnos/SincronizarReglas/' + pIdServicio + '/' + pIdRecurso + '/' + pIdTipoRecurso + '/' + pOrigen + '/' + pDestino;
				return DotService.Get(_url);
			}

			function crearCopiaDePlantilla(pIdPlantilla) {
				var _url = 'PlantillasDeTurnos/CrearCopiaDePlantillaProximoCuatrismetre/' + pIdPlantilla;
				return DotService.Get(_url);
			}

			function ObtenerSemanaDeTurnosPorGenerarParaGrilla(pIdPlantilla, pCurrentPage, pPageSize) {
				var _url = 'DisponibilidadDeTurnos/ObtenerSemanaDeTurnosPorGenerarParaGrilla/'  + pIdPlantilla + "/" + pCurrentPage + "/" + pPageSize;
				return DotService.Get(_url);
			}

			function obtenerSemanaDeTurnosPorGenerarExportarExcel(pIdPlantilla){
				var _url = 'DisponibilidadDeTurnos/ObtenerSemanaDeTurnosPorGenerarExportarExcel/' + pIdPlantilla;
				return DotService.DownloadFile(_url, 'PlantillaLista' + pIdPlantilla + '.xlsx');
			}

			function obtenerSemanaDeTurnosPorGenerarExportarPdf(pIdPlantilla){
				var _url = 'DisponibilidadDeTurnos/ObtenerSemanaDeTurnosPorGenerarExportarPdf/' + pIdPlantilla;
				return DotService.DownloadFile(_url, 'PlantillaLista' + pIdPlantilla + '.pdf');
			}

			function actualizarObservacionesInternasPlantilla(observacionesDTO) {
				var _url = 'PlantillasDeTurnos/ActualizarObservacionesInternas';
				return DotService.Post(_url, observacionesDTO);
			}

			function actualizarObservacionesPortalPlantilla(observacionesDTO) {
				var _url = 'PlantillasDeTurnos/ActualizarObservacionesParaPortal';
				return DotService.Post(_url, observacionesDTO);
			}

			function exportarExcel(pIdPlantilla){
				var _url = 'PlantillasDeTurnos/ExportarExcel/' + pIdPlantilla;
				return DotService.DownloadFile(_url, 'Plantilla de Turnos ' + pIdPlantilla + '.xlsx');
			}

			function exportarPdf(pIdPlantilla){
				var _url = 'PlantillasDeTurnos/ExportarPdf/' + pIdPlantilla;
				return DotService.DownloadFile(_url, 'Plantilla de Turnos' + pIdPlantilla + '.pdf');
			}

			function ObtenerTodosDeUnServicioEnSucursal(pIdServicio, pIdSucursal) {
				var _url = 'Recurso/ObtenerTodosDeUnServicioEnSucursal/' + pIdServicio + "/" + pIdSucursal ;
				return DotService.Get(_url);
			}

			function obtenerAuditoriaPlantillaDeTurnosPorId(pIdPlantillaDeTurno) {
				var _url = 'PlantillasDeTurnos/ObtenerAuditoria/' + pIdPlantillaDeTurno;
				return DotService.Get(_url);
			}

			function obtenerAuditoriaReglasDuracionesDeTurnos(pIdReglaDuracionId) {
				var _url = 'DuracionDeTurnos/ObtenerAuditoria/' + pIdReglaDuracionId;
				return DotService.Get(_url);
			}

		}
	};

	return module;
})();