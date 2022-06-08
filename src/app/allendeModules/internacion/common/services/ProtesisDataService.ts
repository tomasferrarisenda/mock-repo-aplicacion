import { IDtoService } from "core/http";

/**
 * @author 			emansilla
 * @description 	description
 */
export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('ProtesisDataService', ProtesisDataService);

		ProtesisDataService.$inject = ['DotService', 'Logger'];
		
		function ProtesisDataService (DotService: IDtoService, $log) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('ProtesisDataService');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			const service = {
				// Tipo y Estado
				getAllTiposProtesisGestion : getAllTiposProtesisGestion,
				getAllTipoProtesisPreadmision : getAllTipoProtesisPreadmision,
				getAllPrioridadProtesis : getAllPrioridadProtesis,
				getAllDepositoProtesis : getAllDepositoProtesis,
				getAllEstadoProtesisAutorizacion: getAllEstadoProtesisAutorizacion,
				getAllEstadoProtesisVerificacion: getAllEstadoProtesisVerificacion,
				getAllEstadoProtesisEsterilizacion: getAllEstadoProtesisEsterilizacion,
				getAllProveedoresPreAdmision: getAllProveedoresPreAdmision,
				addOneProveedorPreAdmision: addOneProveedorPreAdmision,

				// Protesis
				update : registrarAutorizacion,
				registrarRecepcion : registrarRecepcion,
				registrarVerificacion : registrarVerificacion,
				registrarEsterilizacion : registrarEsterilizacion,
				registrarEntregaBanco : registrarEntregaBanco,

				getAllByIntervencion : getAllByIntervencion,

				getObservacionesAll : getObservacionesAll,
				getObservacionesVerificacion : getObservacionesVerificacion,
				getObservacionesEsterilizacion : getObservacionesEsterilizacion,
				getObservacionesAutorizacion : getObservacionesAutorizacion
			};

			return service;

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			/* PROTESIS */

			function registrarRecepcion (pObject) {
				var _url = 'legacy/ProtesisPreadmision/Recepcion/';
				return DotService.Post(_url, pObject, {isDictionary: true});
			}

			function registrarVerificacion (pObject) {
				var _url = 'legacy/ProtesisPreadmision/Verificacion/';
				return DotService.Post(_url, pObject, {isDictionary: true});
			}

			function registrarEsterilizacion (pObject) {
				var _url = 'legacy/ProtesisPreadmision/Esterilizacion/';
				return DotService.Post(_url, pObject, {isDictionary: true});	
			}

			function registrarEntregaBanco (pObject) {
				var _url = 'legacy/ProtesisPreadmision/Huesos/';
				return DotService.Post(_url, pObject, {isDictionary: true});	
			}

			function registrarAutorizacion (pProtesis) {
				var _url = 'legacy/ProtesisPreadmision/Autorizacion/';
				return DotService.Post(_url, pProtesis);
			}

			function getObservacionesAll (pIdProtesis) {
				var _url = 'legacy/ProtesisPreadmision/Observaciones/All/' + pIdProtesis;
				return DotService.Get(_url);
			}

			function getObservacionesAutorizacion (pIdProtesis) {
				var _url = 'legacy/ProtesisPreadmision/Observaciones/Autorizacion/' + pIdProtesis;
				return DotService.Get(_url);
			}

			function getObservacionesEsterilizacion (pIdProtesis) {
				var _url = 'legacy/ProtesisPreadmision/Observaciones/Esterilizacion/' + pIdProtesis;
				return DotService.Get(_url);
			}

			function getObservacionesVerificacion (pIdProtesis) {
				var _url = 'legacy/ProtesisPreadmision/Observaciones/Verificacion/' + pIdProtesis;
				return DotService.Get(_url);
			}

			function getAllByIntervencion (pIdIntervencion) {
				var _url = 'legacy/ProtesisPreadmision/Intervencion/' + pIdIntervencion;
				return DotService.Get(_url);
			}

			/* TIPOS Y ESTADOS */
			function getAllPrioridadProtesis () {
				var _url = 'legacy/PrioridadProtesis/';
				return DotService.Get(_url);
			}

			function getAllTipoProtesisPreadmision () {
				var _url = 'legacy/TipoProtesis/';
				return DotService.Get(_url);
			}

			function getAllTiposProtesisGestion () {
				var _url = 'legacy/TipoGestionProtesis/';
				return DotService.Get(_url);
			}

			function getAllDepositoProtesis () {
				var _url = 'legacy/DepositoProtesis/';
				return DotService.Get(_url);
			}

			function getAllEstadoProtesisAutorizacion() {
				var _url = 'legacy/EstadoProtesisAutorizacion';
				return DotService.Get(_url);
			}

			function getAllEstadoProtesisVerificacion() {
				var _url = 'legacy/EstadoProtesisVerificacion';
				return DotService.Get(_url);
			}

			function getAllEstadoProtesisEsterilizacion() {
				var _url = 'legacy/EstadoProtesisEsterilizacion';
				return DotService.Get(_url);
			}

			function getAllProveedoresPreAdmision() {
				var _url = 'legacy/ProveedorPreadmision';
				return DotService.Get(_url);
			}

			function addOneProveedorPreAdmision(pProveedor) {
				var _url = 'legacy/ProveedorPreadmision/Add';
				return DotService.Post(_url, pProveedor);
			}
		}
	};

	return module;

})();