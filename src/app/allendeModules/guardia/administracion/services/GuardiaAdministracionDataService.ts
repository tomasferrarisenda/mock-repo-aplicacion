import { IDtoService } from "core/http";

export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('GuardiaAdministracionDataService', GuardiaAdministracionDataService);

		// Inyección de dependencia
		GuardiaAdministracionDataService.$inject = ['DotService', '$log']

		// Definición del servicio
		function GuardiaAdministracionDataService (DotService: IDtoService, $log) {

			$log.debug('GuardiaAdministracionDataService: ON.-');
 		
			

			// API o Interface
			const service = {
				GetUbicacionBySucursal: GetUbicacionBySucursal,
				GetPrescripcionesByUbicacionAndFecha:GetPrescripcionesByUbicacionAndFecha,
				GetAllMateriales: GetAllMateriales,
				GetDetallesPracticaById:GetDetallesPracticaById,
				GetPracticasMedicas:GetPracticasMedicas,
				GetDetallesMaterialById:GetDetallesMaterialById,
				getFirmaMedico:getFirmaMedico,
				GetEvolucionByPrescripcion:GetEvolucionByPrescripcion,
				GetFacturablesById:GetFacturablesById,
				GetDestinos:GetDestinos,
				GuardarFacturables:GuardarFacturables
				
			};

			return service;

			function GetUbicacionBySucursal(pIdSucursal) {
				var _url = 'Ubicacion/GetUbicacionGuardiaBySucursal/' + pIdSucursal;
				return DotService.Get(_url);
			}

			function GetPrescripcionesByUbicacionAndFecha(_object) {
				var _url = 'Prescripcion/GetAllByUbicacionAndFechas/';
				return DotService.Post(_url, _object, { isDictionary: true });
			}

			function GetAllMateriales() {
				var _url = '/Material/';
				return DotService.Get(_url);
			}

			function GetDetallesPracticaById(pPrescripcion) {
				var _url = 'PrescripcionDetalle/GetDetallesPracticasByIdPrescripcion/' + pPrescripcion;
				return DotService.Get(_url);
			}

			function GetPracticasMedicas() {
				var _url = 'Indicacion/GetPracticaMedica';
				return DotService.Get(_url);
			}

			function GetDetallesMaterialById(pPrescripcion) {
				var _url = 'PrescripcionDetalleMaterial/GetDetallesMaterialByIdPrescripcion/' + pPrescripcion;
				return DotService.Get(_url);
			}

			function getFirmaMedico (pNumeroMatricula) {
				var _url = 'UsuarioMedico/GetFirma/' + pNumeroMatricula;
				return DotService.Get(_url);
			}

			function GetEvolucionByPrescripcion(pPrescripcion) {
				var _url = 'Prescripcion/GetValoracionByPrescipcion/' + pPrescripcion;
				return DotService.Get(_url);
			}

			function GetFacturablesById(pIdPrescripcion) {
				var _url = 'Prescripcion/GetFacturablesById/' + pIdPrescripcion;
				return	DotService.Get(_url);
				// body...
			}

			function GetDestinos() {
				var _url = 'Prescripcion/GetDestinos/';
				return DotService.Get(_url);
				// body...
			}
			function GuardarFacturables(pCabecera) {
				var _url = 'Prescripcion/GuardarItemsFacturables/';
				return DotService.Post(_url,pCabecera);

			}


			
		};
	};

	return module;
})();