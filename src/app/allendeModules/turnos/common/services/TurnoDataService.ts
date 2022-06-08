/**
 * @author:			Pablo Pautasso
 * @description:	Data service para turno ba
 * @type:			Service
 **/
export default (function () {
   'use strict';
   

	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('TurnoDataService', TurnoDataService);

		TurnoDataService.$inject = ['DotService', 'Logger'];
		
		function TurnoDataService (DotService, $log) {

			$log = $log.getInstance('TurnoDataService');

			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */
	
			const service = {
				GetAll : GetAll,
				getTurnoById : getTurnoById,
				Add : Add,
				Update : Update,
				New : New,				

				obtenerNuevoTurnoAsignable : obtenerNuevoTurnoAsignable,
				obtenerNuevoMultipleTurnoAsignable : obtenerNuevoMultipleTurnoAsignable,

				validarAsignarTurno: validarAsignarTurno,
				validarAsignarTurnoDesdeRecepcion: validarAsignarTurnoDesdeRecepcion,
				
				asignarTurno : asignarTurno,
				evaluarTurnoContraConvenio: evaluarTurnoContraConvenio,
				evaluarImportesTurnoContraConvenio : evaluarImportesTurnoContraConvenio,
				validarAsignarTurnosMultiples : validarAsignarTurnosMultiples,
				asignarTurnosMultiple : asignarTurnosMultiple,

				obtenerNuevoCriterioBusqueda : obtenerNuevoCriterioBusqueda,
				obtenerNuevoCriterioBusquedaCal : ObtenerNuevoCriterioBusquedaCalendarioServicioDTO,
				obtenerNuevoCriterioBusquedaConFechas : obtenerNuevoCriterioBusquedaConFechas,

				obtenerNuevoCriterioBusquedaList : obtenerNuevoCriterioBusquedaList,

				obtenerTurnosPorPaciente : obtenerTurnosPorPaciente,
				obtenerTurnosPorPacienteConLegacy : obtenerTurnosPorPacienteConLegacy,
				cancelarTurnoPaciente : cancelarTurnoPaciente,

				obtenerMotivosCancelacionTurno : obtenerMotivosCancelacionTurno,
				obtenerMotivosDeCancelacionDeUnTurno: obtenerMotivosDeCancelacionDeUnTurno,

				obtenerTiposEstadoTurnos: obtenerTiposEstadoTurnos,

				//validar Receptar turno
				validarReceptarTurno : validarReceptarTurno,
				receptarTurno : receptarTurno,
				enviarAEfector : enviarAEfector,
				enviarAEfectorTurnoManualmente : enviarAEfectorTurnoManualmente,

				//obtener reprogramacion turnos sin proceso
				// obtenerTurnosCanceladosXServicioXRecurso : obtenerTurnosCanceladosXServicioXRecurso,
				// obtenerTurnosCanceladosXServicio : obtenerTurnosCanceladosXServicio,
				// obtenerTurnosCanceladosXFecha : obtenerTurnosCanceladosXFecha,

				obtenerTurnosCanceladosGrilla: obtenerTurnosCanceladosGrilla,

				//reprogramacion de turno
				reprogramarTurnoSimpleManualmente : reprogramarTurnoSimpleManualmente,
				reprogramarTurnoMultipleManualmente : reprogramarTurnoMultipleManualmente,
				obtenerNuevoReprogramarTurnoSimple : obtenerNuevoReprogramarTurnoSimple,
				obtenerNuevoReprogramarTurnoMultiple : obtenerNuevoReprogramarTurnoMultiple,

				validarDesistirDeReprogramar: validarDesistirDeReprogramar,
				desistirDeReprogramar: desistirDeReprogramar,
				validarCancelarDesisteDeReprogramar: validarCancelarDesisteDeReprogramar,
				cancelarDesisteDeReprogramar: cancelarDesisteDeReprogramar,

				validarMarcarTurnoComoGestionadoReprogramacion: validarMarcarTurnoComoGestionadoReprogramacion,
				marcarTurnoComoGestionadoReprogramacion: marcarTurnoComoGestionadoReprogramacion,

				validarCancelarMarcarTurnoComoGestionado: validarCancelarMarcarTurnoComoGestionado,
				cancelarMarcarTurnoComoGestionado: cancelarMarcarTurnoComoGestionado,

				validarMarcarRellamado: validarMarcarRellamado,
				marcarRellamado: marcarRellamado,
				validarCancelarMarcarRellamado: validarCancelarMarcarRellamado,
				cancelarMarcarRellamado: cancelarMarcarRellamado,


				obtenerNuevoSobreturnoDnpDto: obtenerNuevoSobreturnoDnpDto,
				validarAsignarSobreTurnoDNP: validarAsignarSobreTurnoDNP,
				asignarSobreTurnoDNP: asignarSobreTurnoDNP,

				obtenerConLogAuditoriaPorId: obtenerConLogAuditoriaPorId,

				validarAnularRecepcion : validarAnularRecepcion,
				anularRecepcion : anularRecepcion,

				marcarTurnoComoPagado: marcarTurnoComoPagado,
				anularMarcadoTurnoComoPagado: anularMarcadoTurnoComoPagado,
				enviarTurnoACaja: enviarTurnoACaja,
				actualizarMutualPlan: actualizarMutualPlan,

				validarFiltrosDeEdadSexo: validarFiltrosDeEdadSexo,
				validarFiltrosDeSexo: validarFiltrosDeSexo,

				actualizarObservacionesPrincipales: actualizarObservacionesPrincipales,

				obtenerObservacionesPorTurno: obtenerObservacionesPorTurno,
				anularRecepcionConMotivo: anularRecepcionConMotivo,

				obtenerNuevoActualizarObservacionesPrincipales: obtenerNuevoActualizarObservacionesPrincipales,
				actualizarObservacionesPrincipalesDto: actualizarObservacionesPrincipalesDto,

				reprogramacionExportarAExcel: reprogramacionExportarAExcel,

				obtenerTurnosConEstadoDeConfirmacion: obtenerTurnosConEstadoDeConfirmacion,

				rellamarPorTurno: rellamarPorTurno,

				iniciarAtencion: iniciarAtencion,
				anularIniciarAtencion: anularIniciarAtencion,

				finalizarAtencion: finalizarAtencion,
				anularFinalizarAtencion: anularFinalizarAtencion,

				llamar : llamar
			};

			return service;

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			
			function GetAll () {
				var _url = 'Turnos/';
				return DotService.Get(_url);
			}

			function getTurnoById (pId) {
				var _url = 'Turnos/ObtenerPorId/' + pId;
				return DotService.Get(_url);
			}

			function Add (pData) {
				var _url = 'Turnos/';
				return DotService.Post(_url, pData);
			}

			function Update (pData) {
				var _url = 'Turnos/';
				return DotService.Put(_url, pData);
			}
			
			function New () {
				var _url = 'Turnos/New';
				return DotService.Get(_url);
			}

			function obtenerNuevoTurnoAsignable() {
				var _url = 'Turnos/ObtenerNuevoAsignarTurnoSimpleDto';
				return DotService.Get(_url);
			}

			function obtenerNuevoMultipleTurnoAsignable() {
				var _url = 'Turnos/ObtenerNuevoAsignarTurnoMultipleDto';
				return DotService.Get(_url);
			}


			function validarAsignarTurno(pAsignarTurnoSimpleDto) {
				var _url = 'Turnos/ValidarAsignar';
				return DotService.Post(_url, pAsignarTurnoSimpleDto);
			}

			function validarAsignarTurnoDesdeRecepcion(pasignarTurnoSimpleDto) {
				var _url = 'Turnos/ValidarAsignarTurnoDesdeRecepcion';
				return DotService.Post(_url, pasignarTurnoSimpleDto);
			}

			
			function asignarTurno(pAsignarTurnoSimpleDto) {
				var _url = 'Turnos/Asignar';
				return DotService.Post(_url, pAsignarTurnoSimpleDto);
			}

			function evaluarTurnoContraConvenio(pAsignarTurnoSimpleDto) {
				var _url = 'Turnos/EvaluarTurnoContraConvenio';
				return DotService.Post(_url, pAsignarTurnoSimpleDto);
			}

			function evaluarImportesTurnoContraConvenio(pAsignarTurnoSimpleDto) {
				var _url = 'Turnos/EvaluarImportesTurnoContraConvenio';
				return DotService.Post(_url, pAsignarTurnoSimpleDto);
			}

			function obtenerTurnosPorPaciente(pIdPaciente,pFechaDesde,pFechaHasta, pIdServicio) {
				var _url;
				if(pIdServicio)
				_url = 'Turnos/ObtenerTurnosPorPaciente/' + pIdPaciente + "/" + pFechaDesde + "/" + pFechaHasta + "/" + pIdServicio;
				else
				_url = 'Turnos/ObtenerTurnosPorPaciente/' + pIdPaciente + "/" + pFechaDesde + "/" + pFechaHasta;				
				return DotService.Get(_url);
			}

			function obtenerTurnosPorPacienteConLegacy(pIdPaciente, pFechaDesde, pFechaHasta, pIdServicio) {
				var _url;
				_url = 'Turnos/ObtenerTurnosPorPacienteConLegacy/' + pIdPaciente + "/" + pFechaDesde + "/" + pFechaHasta + "/" + pIdServicio;
				return DotService.Get(_url);
			}

			function cancelarTurnoPaciente(pCancelarTurnoDto) {
				var _url = 'Turnos/CancelarTurno/';
				return DotService.Post(_url, pCancelarTurnoDto);
			}

			function obtenerMotivosCancelacionTurno() {
				var _url = 'MotivosDeAnulacionTurno/ObtenerTodos';
				return DotService.Get(_url, { isCachable: true });
			}

			function obtenerMotivosDeCancelacionDeUnTurno(pIdTurno) {
				var _url = 'Turnos/ObtenerConMotivosDeCancelacion/' + pIdTurno;
				return DotService.Get(_url);
			}

			function validarAsignarTurnosMultiples(pAsignarTurnoMultipleDTO) {
				var _url = 'Turnos/ValidarAsignarMultiples';
				return DotService.Post(_url, pAsignarTurnoMultipleDTO);
			}

			function asignarTurnosMultiple(pAsignarTurnoMultipleDTO) {
				var _url = 'Turnos/AsignarTurnoMultiple';
				return DotService.Post(_url, pAsignarTurnoMultipleDTO);
			}

			
			function obtenerNuevoCriterioBusquedaConFechas() {
				var _url = 'CriterioBusqueda/ObtenerNuevoCriterioBusquedaConFechasDTO';
				return DotService.Get(_url, { isCachable: true });
			}


			function obtenerNuevoCriterioBusqueda() {
				var _url = 'CriterioBusqueda/ObtenerNuevo';
				return DotService.Get(_url, { isCachable: true });
			}
			

			function ObtenerNuevoCriterioBusquedaCalendarioServicioDTO() {
				var _url = 'CriterioBusqueda/ObtenerNuevoCriterioBusquedaCalendarioServicioDTO';
				return DotService.Get(_url);
			}

			function obtenerNuevoCriterioBusquedaList() {
				var _url = 'CriterioBusqueda/ObtenerNuevaListaCriterioBusquedaDTO';
				return DotService.Get(_url);
			}


			function obtenerTiposEstadoTurnos() {
				var _url = 'EstadosDeTurnos/ObtenerTodos';
				return DotService.Get(_url,{ isCachable: true });
			}

			function validarReceptarTurno(pIdTurno) {
				var _url = 'Turnos/ValidarReceptar/' + pIdTurno;
				return DotService.Get(_url);
			} 

			function receptarTurno(pIdTurno) {
				var _url = 'Turnos/Receptar/' + pIdTurno;
				return DotService.Get(_url);
			} 

			function enviarAEfector(pIdTurno) {
				var _url = 'Turnos/EnviarAEfector/' + pIdTurno;
				return DotService.Get(_url);
			}
			
			function enviarAEfectorTurnoManualmente(pIdTurno) {
				var _url = 'Efectores/RecepcionServicioEfector/EnviarAEfectorTurnoManualmente/' + pIdTurno;
				return DotService.Get(_url);
			}

			//obtener turnos cancelados con grilla por back
			//DEPRECATED por  ObtenerTurnosCanceladosGrilla(filtroReprogramacionDTO)

			// function obtenerTurnosCanceladosXServicioXRecurso(pFechaDesde, pFechaHasta, pIdServicio, pIdRecurso, 
			// 	pIdTipoRecurso, pSoloPendientes, pCurrentPage, pPageSize) {
			// 	var _url = 'Turnos/ObtenerTurnosCanceladosGrilla/'  + pFechaDesde + "/" + pFechaHasta + "/" + pIdServicio + "/" +
			// 	pIdRecurso + "/" + pIdTipoRecurso + "/" + pSoloPendientes + "/" + pCurrentPage + "/" + pPageSize;
			// 	return DotService.Get(_url);
			// }

			// function obtenerTurnosCanceladosXServicio(pFechaDesde, pFechaHasta, pIdServicio, pSoloPendientes, pCurrentPage, pPageSize) {
			// 	var _url = 'Turnos/ObtenerTurnosCanceladosGrilla/'  + pFechaDesde + "/" + pFechaHasta + "/" + pIdServicio + "/" +
			// 	pSoloPendientes + "/" + pCurrentPage + "/" + pPageSize;
			// 	return DotService.Get(_url);
			// }
	
			// function obtenerTurnosCanceladosXFecha(pFechaDesde, pFechaHasta, pSoloPendientes, pCurrentPage, pPageSize) {
			// 	var _url = 'Turnos/ObtenerTurnosCanceladosGrilla/'  + pFechaDesde + "/" + pFechaHasta + "/" + 
			// 	pSoloPendientes + "/" + pCurrentPage + "/" + pPageSize;
			// 	return DotService.Get(_url);
			// }


			function obtenerTurnosCanceladosGrilla(filtroReprogramacionDTO) {
				var _url = 'Turnos/ObtenerTurnosCanceladosGrilla';
				return DotService.Post(_url, filtroReprogramacionDTO);
			}

			//reprogramacion turno manualmente
			function reprogramarTurnoSimpleManualmente(pReprogramarTurnoSimpleDTO) {
				var _url = 'Turnos/ReprogramarTurnoSimpleManualmente';
				return DotService.Post(_url, pReprogramarTurnoSimpleDTO);
			}

			function reprogramarTurnoMultipleManualmente(pReprogramarTurnoMultipleDTO) {
				var _url = 'Turnos/ReprogramarTurnoMultipleManualmente';
				return DotService.Post(_url, pReprogramarTurnoMultipleDTO);
			}

			//dentro de reprogramacion obtener nuevo
			function obtenerNuevoReprogramarTurnoSimple() {
				var _url = 'Turnos/ObtenerNuevoReprogramarTurnoSimpleDto';
				return DotService.Get(_url);
			}

			function obtenerNuevoReprogramarTurnoMultiple() {
				var _url = 'Turnos/ObtenerNuevoReprogramarTurnoMultipleDto';
				return DotService.Get(_url);
			}

			function validarDesistirDeReprogramar(pIdTurno) {
				var _url = 'Turnos/ValidarDesistirDeReprogramar/' + pIdTurno;
				return DotService.Get(_url);
			}

			function desistirDeReprogramar(pIdTurno) {
				var _url = 'Turnos/DesistirDeReprogramar/' + pIdTurno;
				return DotService.Get(_url);
			}

			function validarMarcarTurnoComoGestionadoReprogramacion(pIdTurno) {
				var _url = 'Turnos/ValidarMarcarReprogramacionGestionada/' + pIdTurno;
				return DotService.Get(_url);
			}

			function marcarTurnoComoGestionadoReprogramacion(pIdTurno, pObservacion) {
				var _url = 'Turnos/MarcarReprogramacionGestionada/';
				return DotService.Post(_url, {IdTurno: pIdTurno, Observaciones: pObservacion});
			}

			function validarCancelarDesisteDeReprogramar(pIdTurno) {
				var _url = 'Turnos/ValidarCancelarDesisteDeReprogramar/' + pIdTurno;
				return DotService.Get(_url);
			}

			function cancelarDesisteDeReprogramar(pIdTurno) {
				var _url = 'Turnos/CancelarDesisteDeReprogramar/' + pIdTurno;
				return DotService.Get(_url);
			}

			function validarCancelarMarcarTurnoComoGestionado(pIdTurno) {
				var _url = 'Turnos/ValidarCancelarMarcarReprogramacionGestionada/' + pIdTurno;
				return DotService.Get(_url);
			}

			function cancelarMarcarTurnoComoGestionado(pIdTurno) {
				var _url = 'Turnos/CancelarMarcarReprogramacionGestionada/' + pIdTurno;
				return DotService.Get(_url);
			}



			function validarMarcarRellamado(pIdTurno) {
				var _url = 'Turnos/ValidarMarcarRellamado/' + pIdTurno;
				return DotService.Get(_url);
			}

			function marcarRellamado(pIdTurno) {
				var _url = 'Turnos/MarcarRellamado/' + pIdTurno;
				return DotService.Get(_url);
			}

			function validarCancelarMarcarRellamado(pIdTurno) {
				var _url = 'Turnos/ValidarCancelarMarcarRellamado/' + pIdTurno;
				return DotService.Get(_url);
			}

			function cancelarMarcarRellamado(pIdTurno) {
				var _url = 'Turnos/CancelarMarcarRellamado/' + pIdTurno;
				return DotService.Get(_url);
			}




			function obtenerNuevoSobreturnoDnpDto() {
				var _url = 'Turnos/ObtenerNuevoSobreturnoDnpDto';
				return DotService.Get(_url);
			}
		
			function validarAsignarSobreTurnoDNP(pSobreTurnoDnpDTO) {
				var _url = 'Turnos/ValidarAsignarSobreTurnoDNP';        
				return DotService.Post(_url, pSobreTurnoDnpDTO);
			}
		
			function asignarSobreTurnoDNP(pSobreTurnoDnpDTO) {
				var _url = 'Turnos/asignarSobreTurnoDNP';        
				return DotService.Post(_url, pSobreTurnoDnpDTO);
			}

			// function obtenerConLogAuditoriaPorId(pIdTurno) {
			// 	var _url = 'Turnos/ObtenerConLogAuditoriaPorId/' + pIdTurno;
			// 	return DotService.Post(_url, pIdTurno);
			// }

			function obtenerConLogAuditoriaPorId(pIdTurno, pCurrentPage, pPageSize) {
				var _url = 'Turnos/ObtenerConLogAuditoriaPorId/' + pIdTurno + "/" + pCurrentPage + "/" + pPageSize;
				return DotService.Get(_url);
			}

			// function ObtenerSemanaDeTurnosPorGenerarParaGrilla(pIdPlantilla, pCurrentPage, pPageSize) {
			// 	var _url = 'DisponibilidadDeTurnos/ObtenerSemanaDeTurnosPorGenerarParaGrilla/'  + pIdPlantilla + "/" + pCurrentPage + "/" + pPageSize;
			// 	return DotService.Get(_url);
			// }

			function validarAnularRecepcion(pIdTurno) {
				var _url = 'Turnos/ValidarAnularRecepcion/' + pIdTurno;
				return DotService.Get(_url);
			}

			function anularRecepcion(pIdTurno) {
				var _url = 'Turnos/AnularRecepcion/' + pIdTurno;
				return DotService.Get(_url);
			}

			function marcarTurnoComoPagado(pIdTurno) {
				var _url = 'Turnos/MarcarTurnoComoPagado/' + pIdTurno;
				return DotService.Get(_url);
			}

			function anularMarcadoTurnoComoPagado(pIdTurno) {
				var _url = 'Turnos/AnularMarcadoTurnoComoPagado/' + pIdTurno;
				return DotService.Get(_url);
			}

			function enviarTurnoACaja(pIdTurno) {
				var _url = 'Turnos/EnviarTurnoACaja/' + pIdTurno;
				return DotService.Get(_url);
			}

			function actualizarMutualPlan(pIdTurno, pIdMutual, pIdPlan) {
				var _url = 'Turnos/ActualizarMutualPlan/' + pIdTurno + "/" + pIdMutual + "/" + pIdPlan;
				return DotService.Get(_url);
			}

			function validarFiltrosDeEdadSexo(pIdItemPlantilla, pIdPaciente) {
				var _url = 'Turnos/ValidarFiltrosDeEdadSexo/' + pIdItemPlantilla + "/" + pIdPaciente;
				return DotService.Get(_url);
			}

			function validarFiltrosDeSexo(pIdItemPlantilla, pIdPaciente) {
				var _url = 'Turnos/ValidarFiltrosDeSexo/' + pIdItemPlantilla + "/" + pIdPaciente;
				return DotService.Get(_url);
			}
			
			function actualizarObservacionesPrincipales(pIdTurno, pObservacion) {
				var _url = 'Turnos/ActualizarObservacionesPrincipales/' + pIdTurno + '/' + pObservacion;
				return DotService.Get(_url);
			}

			function obtenerObservacionesPorTurno(pIdTurno) {
				var _url = 'Turnos/ObtenerObservaciones/' + pIdTurno;
				return DotService.Get(_url);
			}

			function anularRecepcionConMotivo(pIdTurno, pObservacion) {
				var _url = 'Turnos/AnularRecepcion/' + pIdTurno + '/' + pObservacion;
				return DotService.Get(_url);
			}

			function obtenerNuevoActualizarObservacionesPrincipales() {
				var _url = 'Turnos/ObtenerNuevoActualizarObservacionesPrincipalesDTO/';
				return DotService.Get(_url);
			}

			function actualizarObservacionesPrincipalesDto(pObservacionesPrincipales) {
				var _url = 'Turnos/ActualizarObservacionesPrincipales';
				return DotService.Post(_url, pObservacionesPrincipales);
			}

			function reprogramacionExportarAExcel(pFechaDesde, pFechaHasta, pIdServicio, pIdRecurso, pIdTipoRecurso, soloPendientes, fecha) {
				var _url = 'Turnos/ExportarExcelTurnosParaReprogramar/' + pFechaDesde + '/' + pFechaHasta + '/' + pIdServicio + '/' + pIdRecurso + '/' + pIdTipoRecurso + '/' + soloPendientes;
				return DotService.DownloadFile(_url, 'Reprogramacion Turnos - ' + fecha + '.xlsx');
			}

			function obtenerTurnosConEstadoDeConfirmacion(filtroTurnosConConfirmacionDTO) {
				var _url = 'Turnos/ObtenerTurnosConEstadoDeConfirmacion';
				return DotService.Post(_url, filtroTurnosConConfirmacionDTO);
			}

			function rellamarPorTurno(pIdTurno) {
				var _url = 'Turnos/Rellamar/' + pIdTurno;
				return DotService.Get(_url);
			}

			function iniciarAtencion(pIdTurno) {
				var _url = 'Turnos/IniciarAtencion/' + pIdTurno;
				return DotService.Get(_url);
			}

			function anularIniciarAtencion(pIdTurno) {
				var _url = 'Turnos/AnularInicioAtencion/'+ pIdTurno;
				return DotService.Get(_url);
			}

			function finalizarAtencion(pIdTurno) {
				var _url = 'Turnos/FinalizarAtencion/'+ pIdTurno;
				return DotService.Get(_url);
			}

			function anularFinalizarAtencion(pIdTurno) {
				var _url = 'Turnos/AnularFinalizarAtencion/'+ pIdTurno;
				return DotService.Get(_url);
			}

			function llamar(pIdTurno, pIdConsultorio) {
				var _url = 'Turnos/Llamar/'+ pIdTurno+ '/' + pIdConsultorio
				return DotService.Get(_url);
			}
		}
	};

	return module;
})();