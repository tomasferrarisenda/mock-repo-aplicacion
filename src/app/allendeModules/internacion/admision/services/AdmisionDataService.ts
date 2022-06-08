import { IDtoService } from "core/http";

/**
 * @author 			emansilla
 * @description 	description
 */
export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('AdmisionDataService', AdmisionDataService);

		AdmisionDataService.$inject = ['DotService', 'Logger'];
		
		function AdmisionDataService (DotService: IDtoService, $log) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('AdmisionDataService');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			/* jshint ignore: start */
			var idInternacion = 0;
			var idIntervencion = 0;
			var numeroInternado = 0;
			var pathReturn = '';
			/* jshint ignore: end */

			const service = {
				getAllInternaciones : getAllInternacionesAprobadas,
				getOneInternacion : getOneInternacionById,
				getOneInternacionByNumero : getOneInternacionByNumero,
				getOneInternacionAdmitidoByNumero : getOneInternacionAdmitidoByNumero,
				getOneInternacionByCamaActual : getOneInternacionByCamaActual,
				getOneForLevantarAlta : getOneForLevantarAlta,
				getOneByIntervencion : getOneByIntervencion,
				updateInternacion : updateInternacion,

				existeParaAdmitir : existeInternacionParaAdmitir,
				tieneAltaAdministrativa : tieneAltaAdministrativa,

				getAval : getAvalInternacion,
				getAvalDiferenciaHabitacion : getAvalDiferenciaHabitacion,
				
				admitirPaciente : admitirPaciente,
				altaPaciente : altaPaciente,
				readmitirPaciente : readmitirPaciente,
				levantarAlta : levantarAlta,
				anularInternacion : anularInternacion,
				revertirInternacion : revertirInternacion,

				getAllAdmitidas : getAllAdmitidas,
				getAllAdmitidasLazy : getAllAdmitidasLazy,
				getAllAdmitidasBySucursal : getAllAdmitidasBySucursal,
				getAllAdmitidasLazyBySucursal : getAllAdmitidasLazyBySucursal,
				getAllPartos : getAllPartos,
				getAllPartosLazy : getAllPartosLazy,

				getAllAdmitidasForProrrogaLazy : getAllAdmitidasForProrrogaLazy,
				getAllAdmitidasForProrrogaLazyBySucursal : getAllAdmitidasForProrrogaLazyBySucursal,
				getAllAdmitidasForProrrogaLazyHabiliatadasParaUsuario : getAllAdmitidasForProrrogaLazyHabiliatadasParaUsuario,

				getAllObservacionesByIdInternado : getAllObservacionesByIdInternado,
				getOneInternacionByNumeroParaStock : getOneInternacionByNumeroParaStock,
				
				newNacimiento : newNacimiento,
				getInternados : getInternados

			};

			return service;

			/* ------------------------------------------ IMPLEMENTACIÓN ------------------------------------------ */

			function getOneForLevantarAlta (pNumeroInternado) {
				var _url = 'legacy/Internacion/ForLevantarAlta/' + pNumeroInternado;
				return DotService.Get(_url);
			}

			function getAvalInternacion () {
				var _url = 'legacy/Aval/Internacion';
				return DotService.Get(_url);
			}

			function getAvalDiferenciaHabitacion () {
				var _url = 'legacy/Aval/DiferenciaHabitacion/';
				return DotService.Get(_url);
			}

			function getAllInternacionesAprobadas (pPage, idSolicitud, numeroDocumento, nombrePaciente, idSucursal) {
				var _url = 'legacy/Internacion/Aprobado/' 
					+ pPage + '/' 
					+ idSolicitud + '/' 
					+ numeroDocumento + '/'
					+ nombrePaciente + '/'
					+ idSucursal;
				return DotService.Get(_url);
			}

			function getOneInternacionById (pIdInternacion) {
				var _url = 'legacy/Internacion/' + pIdInternacion;
				return DotService.Get(_url);
			}

			function getOneInternacionByNumero (pNumeroInternado) {
				var _url = 'NuevaInternacion/ObtenerPorNumero/' + pNumeroInternado;
				return DotService.Get(_url);
			}

			function getOneInternacionAdmitidoByNumero (pNumeroInternado) {
				var _url = 'legacy/Internacion/Admitido/ByNumeroInternado/' + pNumeroInternado;
				return DotService.Get(_url);
			}

			function getOneInternacionByNumeroParaStock (pNumeroInternado) {
				var _url = 'legacy/Internacion/ByNumeroInternadoParaStock/' + pNumeroInternado;
				return DotService.Get(_url);
			}

			function getOneInternacionByCamaActual (pCama) {
				var _url = 'legacy/Internacion/Cama/' + pCama.id_cama;
				return DotService.Get(_url);
			}

			function getOneByIntervencion (pIdInternacion, pIdIntervencionAdmision) {
				var _url = 'legacy/Internacion/' + pIdInternacion + '/IntervencionAdmision/' + pIdIntervencionAdmision;
				return DotService.Get(_url);
			}

			function admitirPaciente (pInternacion) {
				var _url = 'legacy/Internacion/Admitir';
				return DotService.Post(_url, pInternacion);
			}

			function altaPaciente (pInternacion) {
				var _url = 'legacy/Internacion/Alta';
				return DotService.Post(_url, pInternacion);	
			}

			function readmitirPaciente (pIdInternacion) {
				var _url = 'legacy/Internacion/Readmitir/' + pIdInternacion;
				return DotService.Get(_url);
			}

			function levantarAlta (pIdInternacion) {
				var _url = 'legacy/Internacion/LevantarAlta/' + pIdInternacion;
				return DotService.Get(_url);
			}

			function anularInternacion(pIdInternacion, pMotivo) {
				var _url = 'legacy/Internacion/Anular/' + pIdInternacion + '/' + pMotivo;
				return DotService.Get(_url);
			}

			function revertirInternacion(pIdInternacion) {
				var _url = 'legacy/Internacion/Revert/' + pIdInternacion;
				return DotService.Get(_url);
			}

			function updateInternacion (pInternacion) {
				var _url = 'legacy/Internacion/Update';
				return DotService.Post(_url, pInternacion);
			}

			function getAllAdmitidas () {
				var _url = 'legacy/Internacion/Admitido';
				return DotService.Get(_url);
			}

			function getAllAdmitidasLazy () {
				var _url = 'legacy/Internacion/AdmitidoLazy';
				return DotService.Get(_url);
			}

			function getAllAdmitidasBySucursal (pIdSucursal) {
				var _url = 'legacy/Internacion/Admitido/Sucursal/' + pIdSucursal;
				return DotService.Get(_url);
			}

			function getAllAdmitidasLazyBySucursal (pIdSucursal) {
				var _url = 'legacy/Internacion/AdmitidoLazy/Sucursal/' + pIdSucursal;
				return DotService.Get(_url);
			}

			function getAllPartos () {
				var _url = 'legacy/Internacion/Partos';
				return DotService.Get(_url);
			}

			function getAllPartosLazy () {
				var _url = 'legacy/Internacion/PartosLazy';
				return DotService.Get(_url);
			}

			function getAllAdmitidasForProrrogaLazy() {
				var _url = 'legacy/Internacion/AdmitidoProrrogaLazy';
				return DotService.Get(_url);
			}

			function getAllAdmitidasForProrrogaLazyHabiliatadasParaUsuario() {
				var _url = 'legacy/Internacion/AdmitidoProrrogaLazyHabilitadasParaUsuario';
				return DotService.Get(_url);
			}
			
			function getAllAdmitidasForProrrogaLazyBySucursal (pIdSucursal) {
				var _url = 'legacy/Internacion/AdmitidoProrrogaLazy/Sucursal/' + pIdSucursal;
				return DotService.Get(_url);
			}

			function existeInternacionParaAdmitir (pIdInternacion) {
				var _url = 'legacy/Internacion/ExisteParaAdmitir/' + pIdInternacion;
				return DotService.Get(_url);
			}

			function tieneAltaAdministrativa (pIdInternacion) {
				var _url = 'legacy/Internacion/TieneAltaAdministrativa/' + pIdInternacion;
				return DotService.Get(_url);
			}

			function newNacimiento (pObject) {
				var _url = 'legacy/Internacion/NewNacimiento/';
				return DotService.Post(_url, pObject, {isDictionary: true});
			}

			function getAllObservacionesByIdInternado  (pIdInternado) {
				var _url = 'legacy/ObservacionesInternado/Internado/' + pIdInternado;
				return DotService.Get(_url);
			}

			function getInternados(pFiltroInternados) {
				var _url = 'NuevaInternacion/ObtenerInternadosParaModal/';
				return DotService.Post(_url, pFiltroInternados, {isDictionary: true});
			}
		}
	};

	return module;

})();