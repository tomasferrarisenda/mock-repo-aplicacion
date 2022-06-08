import { IDtoService } from "../../../../core/index";
/**
 * @author 			emansilla
 * @description 	description
 */
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('PreadmisionDataService', PreadmisionDataService);

		PreadmisionDataService.$inject = ['DotService', 'Logger'];
		
		function PreadmisionDataService (DotService: IDtoService, $log) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('PreadmisionDataService');
			$log.debug('ON.-');
			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */
			
			/* jshint ignore: start*/
			var idSolicitud = 0;
			var matriculaMedico = 0;
			var clavePaciente = 0;
			var externo = false;

			/* jshint ignore: end*/
			
			const service = {
				new : newSolicitud,

				getAllPreadmision : getAllPreadmision,
				getAllPreadmisionLazy : getAllPreadmisionLazy,
				getAllPreadmisionByFechaCreacion : getAllPreadmisionByFechaCreacion,
				getAllPreadmisionByFechaCreacionLazy : getAllPreadmisionByFechaCreacionLazy,
				getAllPreadmisionByMedicoAndPaciente : getAllPreadmisionByMedicoAndPaciente,
				getAllPreadmisionByMedicoAndPacienteLazy : getAllPreadmisionByMedicoAndPacienteLazy,
				getAllTemplateByMedico : getAllTemplateByMedico,
				getAllReadmisionByPaciente : getAllReadmisionByPaciente,

				readmitirPaciente : readmitirPaciente,

				// Estados y Tipos
				getAllEstadosSolicitud: getAllEstadosSolicitud,
				getAllOrigenesSolicitud: getAllOrigenesSolicitud,

				// Paciente
				getAllTurnosCirugiaByPaciente: getAllTurnosCirugiaByPaciente,
				
				//  Add
				getOneSolicitudPreadmision : getOneSolicitudPreadmision,
				addOnePreadmision: addOnePreadmision,
				addOneUrgentGuardia: addOneUrgentGuardia,
				addOneUrgentConsultorioExterno : addOneUrgentConsultorioExterno,
				addOneUrgentArt : addOneUrgentArt,

				// Update Internacion
				updateOneSolicitudPreadmision : updateOneSolicitudPreadmision,
				updateOneIntervencionPreAdmisionEnProceso: updateOneIntervencionPreAdmisionEnProceso,
				updateOneIntervencionPreAdmisionVerificado: updateOneIntervencionPreAdmisionVerificado,
				updateOneIntervencionPreAdmisionAprobado: updateOneIntervencionPreAdmisionAprobado,
				anularSolicitudPreAdmision: anularSolicitudPreAdmision,

				calcularEstadoPreadmision : calcularEstadoPreadmision
			};
			return service;

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			function newSolicitud () {
				var _url = 'legacy/Internacion/New';
				return DotService.Get(_url);
			}

			function readmitirPaciente (pIdInternacion) {
				var _url = 'legacy/Internacion/Readmitir/' + pIdInternacion;
				return DotService.Get(_url);
			}

			function getAllTemplateByMedico (pNumeroMatricula) {
				var _url = 'legacy/Internacion/TemplateByMedico/' + pNumeroMatricula;
				return DotService.Get(_url);
			}

			function getAllReadmisionByPaciente (pIdPaciente) {
				var _url = 'legacy/Internacion/ReadmsionByPaciente/' + pIdPaciente;
				return DotService.Get(_url);
			}

			function getAllPreadmision () {
				var _url = 'legacy/Internacion/Preadmision';
				return DotService.Get(_url);
			}

			function getAllPreadmisionLazy () {
				var _url = 'legacy/Internacion/Preadmision/Lazy';
				return DotService.Get(_url);
			}

			function getAllPreadmisionByFechaCreacion (pFechas) {
				var _url = 'legacy/Internacion/Preadmision/FechasCreacion/';
				return DotService.Post(_url, pFechas, {isDictionary: true});
			}

			function getAllPreadmisionByFechaCreacionLazy (pFechas) {
				var _url = 'legacy/Internacion/Preadmision/FechasCreacion/Lazy';
				return DotService.Post(_url, pFechas, {isDictionary: true});
			}

			function getAllPreadmisionByMedicoAndPaciente (pMatricula, pClavePaciente) {
				var _url = 'legacy/Internacion/ByProfesionalSolicitanteAndPaciente/'
						+ pMatricula + '/' + pClavePaciente + '/';
				return DotService.Get(_url);
			}

			function getAllPreadmisionByMedicoAndPacienteLazy (pMatricula, pClavePaciente) {
				var _url = 'legacy/Internacion/ByProfesionalSolicitanteAndPaciente/Lazy/'
						+ pMatricula + '/' + pClavePaciente + '/';
				return DotService.Get(_url);
			}

			function getAllEstadosSolicitud() {
				var _url = 'legacy/EstadoPreadmision/';
				return DotService.Get(_url, {isCachable: true});
			}

			function getAllOrigenesSolicitud() {
				var _url = 'legacy/OrigenSolicitud';
				return DotService.Get(_url, { isCachable: true });
			}

			function addOnePreadmision (pSolicitud) {
				var _url = 'legacy/Internacion/Add/Preadmision';
				return DotService.Post(_url, pSolicitud);
			}

			function addOneUrgentConsultorioExterno (pSolicitud) {
				var _url = 'legacy/Internacion/Add/Urgent/ConsultorioExterno';
				return DotService.Post(_url, pSolicitud);
			}

			function addOneUrgentGuardia (pSolicitud) {
				var _url = 'legacy/Internacion/Add/Urgent/Guardia';
				return DotService.Post(_url, pSolicitud);
			}

			function addOneUrgentArt (pSolicitud) {
				var _url = 'legacy/Internacion/Add/Urgent/Art';
				return DotService.Post(_url, pSolicitud);
			}

			function updateOneSolicitudPreadmision (pSolicitud) {
				var _url = 'legacy/Internacion/UpdateCreado';
				return DotService.Post(_url, pSolicitud);
			}

			function updateOneIntervencionPreAdmisionEnProceso(pSolicitud) {
				var _url = 'legacy/Internacion/UpdateEnProceso';
				return DotService.Post(_url, pSolicitud);
			}

			function updateOneIntervencionPreAdmisionVerificado(pSolicitud) {
				var _url = 'legacy/Internacion/UpdateVerificado/';
				return DotService.Post(_url, pSolicitud);
			}

			function updateOneIntervencionPreAdmisionAprobado(pSolicitud) {
				var _url = 'legacy/Internacion/UpdateAprobado/';
				return DotService.Post(_url, pSolicitud);
			}
			
			function anularSolicitudPreAdmision(pSolicitud, pUser) {
				pSolicitud.usuario_baja = pUser.userName;
				var _url = 'legacy/Internacion/Delete';
				return DotService.Post(_url, pSolicitud);
			}

			function getOneSolicitudPreadmision (pClaveSolicitud) {
				var _url = 'legacy/Internacion/' + pClaveSolicitud;
				return DotService.Get(_url);
			}

			function getAllTurnosCirugiaByPaciente (pClavePaciente) {
				var _url = 'legacy/TurnoCirugia/GetByPaciente/' + pClavePaciente;
				return DotService.Get(_url);
			}

			function calcularEstadoPreadmision (pIdInternacion) {
				var _url = 'legacy/Internacion/EstadoPreadmision/' + pIdInternacion;
				return DotService.Get(_url);
			}
			
		}
	};

	return module;

})();