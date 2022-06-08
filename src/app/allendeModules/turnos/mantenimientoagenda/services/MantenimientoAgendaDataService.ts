export default (function () {
   'use strict';
   

	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('MantenimientoAgendaDataService', MantenimientoAgendaDataService);

		MantenimientoAgendaDataService.$inject = ['DotService'];
		
		function MantenimientoAgendaDataService (DotService) {

			//$log.debug('MantenimientoAgendaDataService: ON.-');

			/* ------------------------------ API Y VARIABLES ------------------------------ */

			// var feriado = '';
			// var receso = '';

			const service = {
					getAllEstadoFeriado : getAllEstadoFeriado,
					obtenerFeriadosPorFiltro : obtenerFeriadosPorFiltro,
					obtenerFeriadoPorId : obtenerFeriadoPorId,
					obtenerNuevoFeriado : obtenerNuevoFeriado,
					obtenerNuevaExcepcionFeriado : obtenerNuevaExcepcionFeriado,
					aplicarFeriado : aplicarFeriado,
					anularFeriado : anularFeriado,
					eliminarFeriado : eliminarFeriado,
					guardarFeriado : guardarFeriado,
					validarGuardarFeriado : validarGuardarFeriado,
					validarAplicarFeriado : validarAplicarFeriado,
					validarAnularFeriado : validarAnularFeriado,
					validarEliminarFeriado : validarEliminarFeriado,
					obtenerSucursales : obtenerSucursales,
					obtenerServicios : obtenerServicios,
					obtenerTiposRecursos: obtenerTiposRecursos,
					obtenerRecursos : obtenerRecursos,
					obtenerMotivosRecesos : obtenerMotivosRecesos,
					obtenerDiasSemana : obtenerDiasSemana,
					getAllEstadoReceso : getAllEstadoReceso,
					obtenerRecesosPorFiltro : obtenerRecesosPorFiltro,
					obtenerRecesoPorId : obtenerRecesoPorId,
					obtenerNuevoReceso : obtenerNuevoReceso,
					obtenerNuevoItemReceso : obtenerNuevoItemReceso,
					aplicarReceso : aplicarReceso,
					cancelarReceso : cancelarReceso,
					eliminarReceso : eliminarReceso,
					guardarReceso : guardarReceso,
					validarGuardarReceso : validarGuardarReceso,
					validarAplicarReceso : validarAplicarReceso,
					validarCancelarReceso : validarCancelarReceso,
					validarEliminarReceso : validarEliminarReceso,
					obtenerReporteDeRecesosAplicados: obtenerReporteDeRecesosAplicados,

					//validadores de cancelacion de turnos al aplicar tanto como para
					//feriados como para recesos
					obtenerImpactoAplicarFeriado : obtenerImpactoAplicarFeriado,
					obtenerImpactoAplicarReceso : obtenerImpactoAplicarReceso,
					obtenerImpactoAplicarPlantilla : obtenerImpactoAplicarPlantilla,

					obtenerAuditoriaRecesoPorId: obtenerAuditoriaRecesoPorId,
					obtenerAuditoriaFeriadoPorId: obtenerAuditoriaFeriadoPorId,
					duracionDePrestacion: duracionDePrestacion,

					obtenerFeriadoPorFechaContemplandoExcepciones: obtenerFeriadoPorFechaContemplandoExcepciones,
					obtenerRecesosAplicadosQueAfectanUnDia: obtenerRecesosAplicadosQueAfectanUnDia
			};

			return service;

			/* ------------------------------ IMPLEMENTACIÓN ------------------------------ */

			function getAllEstadoFeriado () {
				var _url = 'EstadoFeriado/ObtenerTodos';
				return DotService.Get(_url);
			}

			function obtenerFeriadosPorFiltro(fechaDesde, fechaHasta, idEstado) {
				var _url = 'Feriado/ObtenerPorFiltro/' + fechaDesde + '/' + fechaHasta + '/' + idEstado;
				return DotService.Get(_url);	
			}

			function obtenerFeriadoPorId(idFeriado) {
				var _url = 'Feriado/ObtenerPorId/' + idFeriado;
				return DotService.Get(_url);	
			}

			function obtenerNuevoFeriado() {
				var _url = 'Feriado/ObtenerNuevo';
				return DotService.Get(_url);		
			}

			function obtenerNuevaExcepcionFeriado() {
				var _url = 'Feriado/ObtenerNuevaExcepcion';
				return DotService.Get(_url);		
			}

			function aplicarFeriado(idFeriado) {
				var _url = 'Feriado/AplicarFeriado/' + idFeriado;
				return DotService.Get(_url);
			}

			function validarAplicarFeriado(idFeriado) {
				var _url = 'Feriado/ValidarAplicar/' + idFeriado;
				return DotService.Get(_url);
			}

			function anularFeriado(idFeriado) {
				var _url = 'Feriado/AnularFeriado/' + idFeriado;
				return DotService.Get(_url);
			}

			function validarAnularFeriado(idFeriado) {
				var _url = 'Feriado/ValidarAnular/' + idFeriado;
				return DotService.Get(_url);
			}

			function eliminarFeriado(idFeriado) {
				var _url = 'Feriado/Eliminar/' + idFeriado;
				return DotService.Get(_url);
			}

			function validarEliminarFeriado(idFeriado) {
				var _url = 'Feriado/ValidarEliminar/' + idFeriado;
				return DotService.Get(_url);
			}

			function guardarFeriado(feriado) {
				var _url = 'Feriado/Guardar';
				return DotService.Post(_url, feriado);
			}

			function validarGuardarFeriado(feriado) {
				var _url = 'Feriado/ValidarGuardar';
				return DotService.Post(_url, feriado);
			}

			function obtenerSucursales () {
				var _url = 'Sucursal/ObtenerTodas';
				return DotService.Get(_url, { isCachable: true });
			}

			function obtenerServicios () {
				var _url = 'Servicio/ObtenerTodos';
				return DotService.Get(_url);
			}

			function obtenerTiposRecursos () {
				var _url = 'TipoRecurso/ObtenerTodos';
				return DotService.Get(_url);
			}
			
			function obtenerRecursos () {
				var _url = 'Recurso/ObtenerTodos';
				return DotService.Get(_url);
			}

			function obtenerMotivosRecesos () {
				var _url = 'MotivoReceso/ObtenerTodos';
				return DotService.Get(_url);
			}

			function obtenerDiasSemana () {
				var _url = 'DiaSemana/ObtenerTodos';
				return DotService.Get(_url, { isCachable: true });
			}

			function getAllEstadoReceso () {
				var _url = 'EstadoReceso/ObtenerTodos';
				return DotService.Get(_url);
			}

			function obtenerRecesosPorFiltro(fechaDesde, fechaHasta, idTipoRecurso, idRecurso, pIdServicio, idEstado, idTipoReceso) {
				var _url = 'Receso/ObtenerPorFiltro/' + fechaDesde + '/' + fechaHasta + '/' + idTipoRecurso + '/' + idRecurso + '/' + pIdServicio + '/' + idEstado + '/' + idTipoReceso ;
				return DotService.Get(_url);	
			}

			function obtenerRecesoPorId(idReceso) {
				var _url = 'Receso/ObtenerPorId/' + idReceso;
				return DotService.Get(_url);	
			}

			function obtenerNuevoReceso() {
				var _url = 'Receso/ObtenerNuevo';
				return DotService.Get(_url);		
			}

			function obtenerNuevoItemReceso() {
				var _url = 'Receso/ObtenerNuevoItem';
				return DotService.Get(_url);		
			}

			function aplicarReceso(idReceso) {
				var _url = 'Receso/AplicarReceso/' + idReceso;
				return DotService.Get(_url);
			}

			function validarAplicarReceso(idReceso) {
				var _url = 'Receso/ValidarAplicar/' + idReceso;
				return DotService.Get(_url);
			}

			function cancelarReceso(idReceso) {
				var _url = 'Receso/CancelarReceso/' + idReceso;
				return DotService.Get(_url);
			}

			function validarCancelarReceso(idReceso) {
				var _url = 'Receso/ValidarCancelar/' + idReceso;
				return DotService.Get(_url);
			}

			function eliminarReceso(idReceso) {
				var _url = 'Receso/Eliminar/' + idReceso;
				return DotService.Get(_url);
			}

			function validarEliminarReceso(idReceso) {
				var _url = 'Receso/ValidarEliminar/' + idReceso;
				return DotService.Get(_url);
			}

			function guardarReceso(receso) {
				var _url = 'Receso/Guardar';
				return DotService.Post(_url, receso);
			}

			function validarGuardarReceso(receso) {
				var _url = 'Receso/ValidarGuardar';
				return DotService.Post(_url, receso);
			}

			function obtenerReporteDeRecesosAplicados(pTipoFecha, pFechaDesde, pFechaHasta, pIdServicio, pIdTipoRecurso, pIdRecurso, pIdSucursal) {
				var _url = 'Receso/ObtenerReporteDeRecesosAplicados/' + pTipoFecha + '/' + pFechaDesde + '/' + pFechaHasta + '/' + pIdServicio 
				+ '/' + pIdTipoRecurso + '/' + pIdRecurso + '/' + pIdSucursal;;
				return DotService.Get(_url);
			} 


			function obtenerImpactoAplicarFeriado(pIdFeriado) {
				var _url = 'Feriado/ObtenerImpactoDeAplicar/' + pIdFeriado;
				return DotService.Get(_url);
			}

			function obtenerImpactoAplicarReceso(pIdReceso) {
				var _url = 'Receso/ObtenerImpactoDeAplicar/' + pIdReceso;
				return DotService.Get(_url);
			}

			function obtenerImpactoAplicarPlantilla(pIdPlantilla) {
				var _url = 'PlantillasDeTurnos/ObtenerImpactosDeAplicarPlantilla/' + pIdPlantilla;
				return DotService.Get(_url);
			}

			function obtenerAuditoriaRecesoPorId(pIdReceso) {
				var _url = 'Receso/ObtenerAuditoria/' + pIdReceso;
				return DotService.Get(_url);
			}

			function obtenerAuditoriaFeriadoPorId(pIdFeriado) {
				var _url = 'Feriado/ObtenerAuditoria/' + pIdFeriado;
				return DotService.Get(_url);
			}

			function duracionDePrestacion(idServicio,idRecurso?,idTipoRecurso?,idSucursal?,idPrestacion?,soloActivos?,soloVisiblePortalWeb?) {
				var _url = 'DuracionDePrestacion/Obtener/'+idServicio+'/'+idRecurso+'/'+idTipoRecurso+'/'+idSucursal+'/'+idPrestacion+'/'+soloActivos+'/'+soloVisiblePortalWeb;
				return DotService.Get(_url);
			}

			function obtenerFeriadoPorFechaContemplandoExcepciones(pFecha, pIdRecurso, pIdTipoRecurso, pIdServicio, pIdSucursal){
				var _url = 'Feriado/ObtenerPorFechaContemplandoExcepciones/'+pFecha+'/'+pIdRecurso+'/'+pIdTipoRecurso+'/'+pIdServicio+'/'+pIdSucursal;
				return DotService.Get(_url);
			}

			function obtenerRecesosAplicadosQueAfectanUnDia(pFecha, pIdTipoRecurso, pIdRecurso, pIdServicio, pIdSucursal) {
				var _url = 'Receso/ObtenerAplicadosQueAfectanUnDia/'+pFecha+'/'+pIdTipoRecurso+'/'+pIdRecurso+'/'+pIdServicio+'/'+pIdSucursal;
				return DotService.Get(_url);
			}

		}
	};

	return module;
})();