/**
 * @author:			drobledo
 * @description:	Simulador de Evaluación de Convenios Data Services
 * @type:			Service
 **/
export default (function () {
	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.factory('SimuladorDataService', SimuladorDataService);

		SimuladorDataService.$inject = ['DotService'];

		function SimuladorDataService(DotService) {
			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */
			const service = {
				tareaLarga: tareaLarga,
				obtenerSucursales: obtenerSucursales,
				obtenerServicios: obtenerServicios,
				obtenerTiposAfiliado: obtenerTiposAfiliado,
				obtenerTiposCN: obtenerTiposCN,
				obtenerNomencladores: obtenerNomencladores,
				obtenerCapitulos: obtenerCapitulos,
				obtenerComplejidades: obtenerComplejidades,
				obtenerTiposConsecuencia: obtenerTiposConsecuencia,
				obtenerCodigosNomenclador: obtenerCodigosNomenclador,
				obtenerCodigoNomencladorPorCodigo: obtenerCodigoNomencladorPorCodigo,
				obtenerNuevoEvaluableSimulador: obtenerNuevoEvaluableSimulador,
				obtenerNuevoParametrosSimulacionDto: obtenerNuevoParametrosSimulacionDto,
				simularEvaluacion: simularEvaluacion,
				obtenerNuevoParametrosSimulacionListaPreciosDto: obtenerNuevoParametrosSimulacionListaPreciosDto,
				simularPreciosPorMutual: simularPreciosPorMutual,
				obtenerNuevoParametrosComparadorPreciosDto: obtenerNuevoParametrosComparadorPreciosDto,
				compararPreciosPorCodigo: compararPreciosPorCodigo,
				obtenerConvenioVigenteALaFecha: obtenerConvenioVigenteALaFecha,
				obtenerNuevoParametrosSimulacionPrefacturaAmbulatorio : obtenerNuevoParametrosSimulacionPrefacturaAmbulatorio,
				simularPrecturarAmbulatorio : simularPrecturarAmbulatorio, 
				obtenerTiposTurno: obtenerTiposTurno,
				obtenerCondicionesMedicas: obtenerCondicionesMedicas
			};

			return service;

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			function obtenerSucursales() {
				var _url = 'Sucursal/ObtenerTodas';
				return DotService.Get(_url, { isCachable: true });
			}

			function obtenerServicios() {
				var _url = 'Servicio/ObtenerTodos';
				return DotService.Get(_url);
			}

			function obtenerTiposAfiliado() {
				var _url = 'TipoAfiliado/SinAmbos';
				return DotService.Get(_url);
			}

			function obtenerTiposCN() {
				var _url = 'TipoCodigoNomenclador/ObtenerTodos';
				return DotService.Get(_url, { isCachable: true });
			}

			function obtenerNomencladores() {
				var _url = 'Nomenclador/ObtenerTodos';
				return DotService.Get(_url, { isCachable: true });
			}

			function obtenerCapitulos() {
				var _url = 'CapituloNomenclador/ObtenerTodos';
				return DotService.Get(_url, { isCachable: true });
			}

			function obtenerComplejidades() {
				var _url = 'ComplejidadCodigoNomenclador/ObtenerTodos';
				return DotService.Get(_url, { isCachable: true });
			}

			function obtenerTiposConsecuencia() {
				var _url = 'Convenio/Clausula/ObtenerTiposConsecuencia';
				return DotService.Get(_url);
			}

			function obtenerCodigosNomenclador() {
				var _url = 'legacy/PracticaMedica/GetParaBusqueda';
				return DotService.Get(_url);
			}

			function obtenerCodigoNomencladorPorCodigo(codigo) {
				var _url = 'legacy/PracticaMedica/GetByCodigo/' + codigo;
				return DotService.Get(_url);
			}

			function obtenerNuevoEvaluableSimulador() {
				var _url = 'Convenio/Simulador/ObtenerNuevoEvaluableSimulador';
				return DotService.Get(_url);
			}

			function obtenerNuevoParametrosSimulacionDto() {
				var _url = 'Convenio/Simulador/ObtenerNuevoParametrosSimulacionDto';
				return DotService.Get(_url);
			}

			function simularEvaluacion(parametrosSimulacion) {
				var _url = 'Convenio/Simulador/SimularEvaluacion';
				return DotService.Post(_url, parametrosSimulacion);
			}

			function obtenerNuevoParametrosSimulacionListaPreciosDto() {
				var _url = 'Convenio/Simulador/ObtenerNuevoParametrosSimulacionListaPreciosDto';
				return DotService.Get(_url);
			}

			function simularPreciosPorMutual(parametrosSimulacion){
				var _url = 'Convenio/Simulador/SimularPreciosPorMutual';
				return DotService.Post(_url, parametrosSimulacion);
			}

			function obtenerNuevoParametrosComparadorPreciosDto() {
				var _url = 'Convenio/Simulador/obtenerNuevoParametrosComparadorPreciosDto';
				return DotService.Get(_url);
			}

			function compararPreciosPorCodigo(parametros){
				var _url = 'Convenio/Simulador/CompararPreciosPorCodigo';
				return DotService.Post(_url, parametros);
			}

			function obtenerConvenioVigenteALaFecha(idFinanciador,fecha) {
				var _url = 'Convenio/ObtenerVigenteALaFecha/' + idFinanciador + "/" + fecha;
				return DotService.Get(_url);
			}

			function tareaLarga(value){
				var _url = 'Convenio/Simulador/TareaMuyLarga/'+value;
				return DotService.Post(_url);
			}

			function obtenerNuevoParametrosSimulacionPrefacturaAmbulatorio(){
				var _url = 'Convenio/Simulador/ObtenerNuevoParametrosSimulacionPrefacturaAmbulatorio';
				return DotService.Get(_url);
			}

			function simularPrecturarAmbulatorio(parametros){
				var _url = 'Convenio/Simulador/SimularPrecturarAmbulatorio';
				return DotService.Post(_url, parametros);
			}

			function obtenerTiposTurno() {
				var _url = 'TiposDeTurnos/ObtenerTodos';
				return DotService.Get(_url, { isCachable: true });
			}

			function obtenerCondicionesMedicas() {
				var _url = 'CondicionMedica/ObtenerTodos';
				return DotService.Get(_url, { isCachable: true });
			}
		}
	};

	return module;
})();