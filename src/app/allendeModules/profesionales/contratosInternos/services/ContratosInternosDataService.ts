/**
 * @author:			Pedro Ferrer
 * @description:	ContratosInternos
 * @type:			Service
 **/
export default (function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('ContratosInternosDataService', ContratosInternosDataService);

		ContratosInternosDataService.$inject = ['DotService'];
		
		function ContratosInternosDataService (DotService) {
			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			var tipoContratableBusqueda = null;
			var matriculaBusqueda = null;
			var profesionalBusqueda = null;
			var contratableBusqueda = null;
			var vigenciaBusqueda = null;
			var currentPage = null;

			const service = {
				CrearFiltroBusquedaContratoInterno : CrearFiltroBusquedaContratoInterno,
				ObtenerPorFiltrados : ObtenerPorFiltrados,
				ObtenerPorId : ObtenerPorId,
				ObtenerNuevo : ObtenerNuevo,
				Guardar : Guardar,
				EstadoContratoInternoObtenerTodos : EstadoContratoInternoObtenerTodos,
				ModoContratacionObtenerTodos : ModoContratacionObtenerTodos,
				CondicionIvaObtenerTodos : CondicionIvaObtenerTodos,
				TipoGananciaObtenerTodos : TipoGananciaObtenerTodos,
				RegimenGananciaObtenerTodos : RegimenGananciaObtenerTodos,
				BancoObtenerTodos : BancoObtenerTodos,
				TipoCuentaBancoObtenerTodos : TipoCuentaBancoObtenerTodos,
				TipoRetencionComercioIndustriaObtenerTodos : TipoRetencionComercioIndustriaObtenerTodos,
				EliminarCuentaContratoPorId : EliminarCuentaContratoPorId,
				EliminarParticipacionContratoPorId : EliminarParticipacionContratoPorId,
				ParticipacionObtenerPorId : ParticipacionObtenerPorId,
				ParticipacionObtenerNuevo : ParticipacionObtenerNuevo,
				CuentaObtenerPorId : CuentaObtenerPorId,
				CuentaObtenerNuevo : CuentaObtenerNuevo,
				SucursalObtenerTodos : SucursalObtenerTodos,
				ServicioObtenerTodos : ServicioObtenerTodos,
				PrestacionMedicaObtenerTodos : PrestacionMedicaObtenerTodos,
				DiaSemanaObtenerTodos : DiaSemanaObtenerTodos,
				TipoCodigoNomencladorObtenerTodos : TipoCodigoNomencladorObtenerTodos,
				CuentaGuardar : CuentaGuardar,
				ParticipacionGuardar : ParticipacionGuardar,
				TipoRetencionObtenerTodos : TipoRetencionObtenerTodos,
				GetNuevoDocumentoAsociadoDto : GetNuevoDocumentoAsociadoDto,
				FacturaDirectoObtenerPorId : FacturaDirectoObtenerPorId,
				FacturaDirectoObtenerNuevo : FacturaDirectoObtenerNuevo,
				FacturaDirectoGuardar : FacturaDirectoGuardar,
				FacturaDirectoEliminarPorId : FacturaDirectoEliminarPorId

			};

			return service;

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */
			
			function CrearFiltroBusquedaContratoInterno () {
				var _url = 'Facturacion/ContratosInternos/ContratoInterno/CrearFiltroBusquedaContratoInterno';
				return DotService.Get(_url);
			}

			function ObtenerPorFiltrados (filtroContratos) {
				var _url = 'Facturacion/ContratosInternos/ContratoInterno/ObtenerPorFiltrados';
				return DotService.Post(_url, filtroContratos);
			}

			function ObtenerPorId (idContrato) {
				var _url = 'Facturacion/ContratosInternos/ContratoInterno/ObtenerPorId/'+ idContrato;
				return DotService.Get(_url);
			}

			function ObtenerNuevo (idContrato) {
				var _url = 'Facturacion/ContratosInternos/ContratoInterno/ObtenerNuevo';
				return DotService.Get(_url);
			}

			function Guardar(contratoDto){
				var _url = 'Facturacion/ContratosInternos/ContratoInterno/Guardar';
				return DotService.Post(_url, contratoDto);
			}

			function EstadoContratoInternoObtenerTodos () {
				var _url = 'Facturacion/ContratosInternos/EstadoContratoInterno/ObtenerTodos';
				return DotService.Get(_url, { isCachable: true });
			}

			function ModoContratacionObtenerTodos () {
				var _url = 'Facturacion/ContratosInternos/ModoContratacion/ObtenerTodos';
				return DotService.Get(_url, { isCachable: true });
			}

			function CondicionIvaObtenerTodos () {
				var _url = 'Facturacion/Comun/CondicionIva/ObtenerTodos';
				return DotService.Get(_url, { isCachable: true });
			}

			function TipoGananciaObtenerTodos () {
				var _url = 'Pagos/TipoGanancia/ObtenerTodos';
				return DotService.Get(_url, { isCachable: true });
			}

			function RegimenGananciaObtenerTodos () {
				var _url = 'Pagos/RegimenGanancia/ObtenerTodos';
				return DotService.Get(_url);
			}

			function TipoCodigoNomencladorObtenerTodos () {
				var _url = 'TipoCodigoNomenclador/ObtenerTodos';
				return DotService.Get(_url, { isCachable: true });
			}

			function BancoObtenerTodos () {
				var _url = 'Pagos/Banco/ObtenerTodos';
				return DotService.Get(_url);
			}
			
			function TipoCuentaBancoObtenerTodos () {
				var _url = 'Pagos/TipoCuentaBanco/ObtenerTodos';
				return DotService.Get(_url, { isCachable: true });
			}

			function TipoRetencionComercioIndustriaObtenerTodos () {
				var _url = 'Pagos/TipoRetencionComercioIndustria/ObtenerTodos';
				return DotService.Get(_url, { isCachable: true });
			}
			
			function CuentaObtenerPorId (idCuenta) {
				var _url = 'ContratosInternos/ConfiguracionCuentaDefecto/ObtenerPorId/'+ idCuenta;
				return DotService.Get(_url);
			}

			function CuentaObtenerNuevo (idContrato) {
				var _url = 'ContratosInternos/ConfiguracionCuentaDefecto/ObtenerNuevo';
				return DotService.Get(_url);
			}

			function EliminarCuentaContratoPorId(idCuenta) {
				var _url = 'ContratosInternos/ConfiguracionCuentaDefecto/Eliminar/'+idCuenta;
				return DotService.Get(_url);
			}

			function ParticipacionObtenerPorId (idParticipacion) {
				var _url = 'LiquidacionHonorarios/PorcentajeRetencionDelContrato/ObtenerPorId/'+ idParticipacion;
				return DotService.Get(_url);
			}

			function ParticipacionObtenerNuevo (idContrato) {
				var _url = 'LiquidacionHonorarios/PorcentajeRetencionDelContrato/ObtenerNuevo';
				return DotService.Get(_url);
			}

			function ParticipacionGuardar(participacion) {
				var _url = 'LiquidacionHonorarios/PorcentajeRetencionDelContrato/Guardar';
				return DotService.Post(_url, participacion);
			}

			function EliminarParticipacionContratoPorId(idParticipacion) {
				var _url = 'LiquidacionHonorarios/PorcentajeRetencionDelContrato/Eliminar/'+idParticipacion;
				return DotService.Get(_url);
			}

			function SucursalObtenerTodos () {
				var _url = 'Sucursal/ObtenerTodas';
				return DotService.Get(_url, { isCachable: true });
			}

			function ServicioObtenerTodos () {
				var _url = 'Servicio/ObtenerTodos';
				return DotService.Get(_url);
			}

			function PrestacionMedicaObtenerTodos () {
				var _url = 'PrestacionMedica/ObtenerTodos';
				return DotService.Get(_url);
			}

			function DiaSemanaObtenerTodos () {
				var _url = 'DiaSemana/ObtenerTodos';
				return DotService.Get(_url, { isCachable: true });
			}

			function TipoRetencionObtenerTodos () {
				var _url = 'LiquidacionHonorarios/TipoRetencionContratoInterno/ObtenerTodos';
				return DotService.Get(_url, { isCachable: true });
			}

			function CuentaGuardar(cuenta) {
				var _url = 'ContratosInternos/ConfiguracionCuentaDefecto/Guardar';
				return DotService.Post(_url, cuenta);
			}

			function GetNuevoDocumentoAsociadoDto() {
				var _url = 'DocumentoAsociado/ObtenerNuevo';
				return DotService.Get(_url);
			}
			function FacturaDirectoObtenerPorId (idFacturaDirecto) {
				var _url = 'ContratosInternos/ConfiguracionFacturaDirecto/ObtenerPorId/'+ idFacturaDirecto;
				return DotService.Get(_url);
			}

			function FacturaDirectoObtenerNuevo (idContrato) {
				var _url = 'ContratosInternos/ConfiguracionFacturaDirecto/ObtenerNuevo';
				return DotService.Get(_url);
			}

			function FacturaDirectoGuardar (facturaDirectto) {
				var _url = 'ContratosInternos/ConfiguracionFacturaDirecto/Guardar';
				return DotService.Post(_url, facturaDirectto);
			}

			function FacturaDirectoEliminarPorId (id) {
				var _url = 'ContratosInternos/ConfiguracionFacturaDirecto/Eliminar/'+id;
				return DotService.Get(_url);
			}


			

		}
	};

	return module;
})();