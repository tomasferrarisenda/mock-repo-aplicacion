/**
 * @author:			XX
 * @description:	Equipos
 * @type:			Service
 **/
export default (function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('EquiposDataService', EquiposDataService);

		EquiposDataService.$inject = ['DotService'];
		
		function EquiposDataService (DotService) {
			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			var matriculaBusqueda = null;
			var nombreBusqueda = null;
			var currentpage = null;

			const service = {
				obtenerPorFiltro : obtenerPorFiltro,
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
				exportarListaToXls : exportarListaToXls,
				ObtenerTodosServicios : ObtenerTodosServicios,
				obtenerPorFiltros : obtenerPorFiltros
			};

			return service;

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */
			
			function obtenerPorFiltro(matricula, nombre) {
				var _url = 'Equipo/ObtenerPorFiltro/' + matricula + '/' + nombre;
				return DotService.Get(_url);
			}

			function obtenerPorFiltros(equipo) {
				var _url = 'Equipo/ObtenerPorFiltros';
				return DotService.Post(_url, equipo);
			}

			function obtenerPorId(id) {
				var _url = 'Equipo/obtenerPorId/' + id;
				return DotService.Get(_url);
			}

			function obtenerNuevo() {
				var _url = 'Equipo/obtenerNuevo';
				return DotService.Get(_url);
			}

			function Guardar(equipoDto){
				var _url = 'Equipo/Guardar';
				return DotService.Post(_url, equipoDto);
			}

			function eliminar(id) {
				var _url = 'Equipo/Eliminar/' + id;
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

			function exportarListaToXls(matricula, nombre) {
				var _url = 'Equipo/ExportListToExcel/'+matricula+'/'+nombre;
				return DotService.DownloadFile(_url, 'Equipos.xlsx');
			}

			function ObtenerTodosServicios(){
				var _url = 'Servicio/ObtenerTodos/false/false';
				return DotService.Get(_url);
			}
		}
	};

	return module;
})();