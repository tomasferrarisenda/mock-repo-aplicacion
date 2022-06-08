/**
 * @author:			XX
 * @description:	Aparatos
 * @type:			Service
 **/
export default (function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('AparatosDataService', AparatosDataService);

		AparatosDataService.$inject = ['DotService'];
		
		function AparatosDataService (DotService) {
			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			var matriculaBusqueda = null;
			var nombrebusqueda = null;

			const service = {
				ObtenerNuevoFiltroBusqueda : ObtenerNuevoFiltroBusqueda,
				obtenerPorId : obtenerPorId,
				obtenerNuevo: obtenerNuevo,
				Guardar: Guardar,
				eliminar : eliminar,
				ConfiguracionGuardar : ConfiguracionGuardar,
				SucursalObtenerTodos : SucursalObtenerTodos,
				ServicioObtenerTodos : ServicioObtenerTodos,
				TipoDeSemanaObtenerTodos : TipoDeSemanaObtenerTodos,
				DiaSemanaObtenerTodos : DiaSemanaObtenerTodos,
				ConfiguracionObtenerPorId : ConfiguracionObtenerPorId,
				ConfiguracionObtenerNuevo : ConfiguracionObtenerNuevo,
				EliminarConfiguracionPorId : EliminarConfiguracionPorId,
				ObtenerTodosServicios : ObtenerTodosServicios,
				obtenerPorFiltros : obtenerPorFiltros
			};

			return service;

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */
			
			function ObtenerNuevoFiltroBusqueda(){
				var _url = 'Aparato/ObtenerNuevoFiltroBusqueda';
				return DotService.Get(_url);
			}

			function obtenerPorFiltros(aparato) {
				var _url = 'Aparato/ObtenerPorFiltros';
				return DotService.Post(_url, aparato);
			}


			function obtenerPorId(id) {
				var _url = 'Aparato/obtenerPorId/' + id;
				return DotService.Get(_url);
			}

			function obtenerNuevo() {
				var _url = 'Aparato/obtenerNuevo';
				return DotService.Get(_url);
			}

			function Guardar(aparatoDto){
				var _url = 'Aparato/Guardar';
				return DotService.Post(_url, aparatoDto);
			}

			function eliminar(id) {
				var _url = 'Aparato/Eliminar/' + id;
				return DotService.Get(_url);
			}

			function ConfiguracionGuardar(configuracion){
				var _url = 'ConfiguracionProfesionalDefecto/Guardar';
				return DotService.Post(_url, configuracion);
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

			function TipoDeSemanaObtenerTodos () {
				var _url = 'TipoDeNumero/ObtenerTodos';
				return DotService.Get(_url);
			}

			function ConfiguracionObtenerPorId(idConfiguracion){
				var _url = 'ConfiguracionProfesionalDefecto/ObtenerPorId/'+ idConfiguracion;
				return DotService.Get(_url);
			}

			function ConfiguracionObtenerNuevo(){
				var _url = 'ConfiguracionProfesionalDefecto/ObtenerNuevo';
				return DotService.Get(_url);
			}

			function EliminarConfiguracionPorId(id) {
				var _url = 'ConfiguracionProfesionalDefecto/Eliminar/' + id;
				return DotService.Get(_url);
			}

			function ObtenerTodosServicios(){
				var _url = 'Servicio/ObtenerTodos/false/false';
				return DotService.Get(_url);
			}
		}
	};

	return module;
})();