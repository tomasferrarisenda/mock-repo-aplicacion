import { IDtoService } from "core/http";

export default (function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('PrefacturaInternacionDataService', PrefacturaInternacionDataService);

		PrefacturaInternacionDataService.$inject = ['DotService', 'Logger'];
		
		function PrefacturaInternacionDataService (DotService: IDtoService, $log) {
			
			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('PrefacturaInternacionDataService');
			$log.debug('ON.-');
			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			const service = {
				getAllTiposDocumento: getAllTiposDocumento,
				getInternadoPorNumero : getInternadoPorNumero,
				getPracticaPorCodigo : getPracticaPorCodigo,
				// getAllCoberturaInternado : getAllCoberturaInternado,
				getCalculoMontosHonorarios : getCalculoMontosHonorarios,
				crearPrefactura : crearPrefactura,
				editarPrefactura : editarPrefactura,
				getCuentasProfesional : getCuentasProfesional,
				getPrefacturaPaciente : getPrefacturaPaciente,
				crearItemPrefactura : crearItemPrefactura,
				editarItemPrefactura : editarItemPrefactura,
				crearParticipanteItemPrefacturado : crearParticipanteItemPrefacturado,
				visarItemPrefactura : visarItemPrefactura,
				ObtenerItemPrefactura : ObtenerItemPrefactura,
				eliminarPractica : eliminarPractica,
			};
			return service;

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			function getAllTiposDocumento() {
				var _url = 'legacy/TipoDocumento/';
				return DotService.Get(_url);
			}

			function getInternadoPorNumero(pNumeroInternado) {
				var _url = 'NuevaInternacion/ObtenerPorNumero/'+ pNumeroInternado;
				return DotService.Get(_url);
			}

			function getPracticaPorCodigo(pCodigoPractica) {
				var _url = 'Facturacion/ByCodigoPractica/'+ pCodigoPractica;
				return DotService.Get(_url);
			}

			// function getAllCoberturaInternado(pInternado){
			// 	var _url = 'Cobertura/GetByCoberturaInternado/'+ pInternado;
			// 	return DotService.Post(_url);
			// }

			function getCalculoMontosHonorarios(pDLLHonorarios) {
				var _url = 'Prefacturacion/CalcularMontoPractica';
				return DotService.Post(_url, pDLLHonorarios, { isDictionary: true });
			}

			function crearPrefactura(){
				var _url = 'Prefacturacion/CrearPrefactura';
				return DotService.Get(_url);
			}

			function editarPrefactura(pPrefactura){
				var _url = 'Prefacturacion/EditarPrefactura';
				return DotService.Post(_url, pPrefactura);
			}

			function getCuentasProfesional(pMatricula){
				var _url = 'Cuenta/getCuentaProfesional/'+ pMatricula;
				return DotService.Get(_url);
			}

			function getPrefacturaPaciente(datosPrefactura){
				var _url = 'Prefacturacion/getPrefacturaPaciente';
				return DotService.Post(_url, datosPrefactura, { isDictionary: true });
			}

			function crearItemPrefactura(){
				var _url = '/Prefacturacion/CrearItemPrefactura';
				return DotService.Get(_url);
			}

			function editarItemPrefactura(pItemPrefactura){
				var _url = 'Prefacturacion/EditarItemPrefactura';
				return DotService.Post(_url, pItemPrefactura);
			}

			function crearParticipanteItemPrefacturado(){
				var _url = 'Prefacturacion/crearParticipanteItemPrefacturado';
				return DotService.Get(_url);
			}

			function visarItemPrefactura(pIdItem) {
				var _url = 'Prefacturacion/VisarItem/'+ pIdItem;
				return DotService.Get(_url);
			}

			function ObtenerItemPrefactura(pIdItem){
				var _url = 'Prefacturacion/ObtenerItemPrefactura/' + pIdItem;
				return DotService.Get(_url);
			}

			function eliminarPractica(pIdItem) {
				var _url = 'Prefacturacion/EliminarPractica/' + pIdItem;
				return DotService.Get(_url);
			}
		}
	};

	return module;
})();