/**
 * @author 			drobledo
 * @description 	DataService para Configuracion de Cuentas por Defecto para Derechos
 */

export default (function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('CuentasDefectoDerechosDataService', CuentasDefectoDerechosDataService);

		CuentasDefectoDerechosDataService.$inject = ['DotService'];
		
		function CuentasDefectoDerechosDataService (DotService) {

			/* ------------------------------ API Y VARIABLES ------------------------------ */

			const service = {
				eliminarCuenta : eliminarCuenta,
				obtenerListadoCuentas : obtenerListadoCuentas,
				obtenerFiltroCuentas : obtenerFiltroCuentas,
				ObtenerCuentaDefectoDerechosDtoParaEdicion : ObtenerCuentaDefectoDerechosDtoParaEdicion,
				CuentaGuardar : CuentaGuardar,
				SucursalObtenerTodos : SucursalObtenerTodos,
				ServicioObtenerTodos : ServicioObtenerTodos,
				CuentaObtenerPorId : CuentaObtenerPorId,
				CuentaObtenerNuevo : CuentaObtenerNuevo
			};

			return service;

			/* ------------------------------ IMPLEMENTACIÓN ------------------------------ */

			function eliminarCuenta(id) {
				var _url = 'CuentasDefectoDerechos/Eliminar/' + id;
				return DotService.Get(_url);
			}

			function obtenerListadoCuentas(filtroDto) {
				var _url = 'CuentasDefectoDerechos/ObtenerPorFiltro';
				return DotService.Post(_url, filtroDto);
			}

			function obtenerFiltroCuentas() {
				var _url = 'CuentasDefectoDerechos/ObtenerFiltroCuentas';
				return DotService.Get(_url);
			}

			function ObtenerCuentaDefectoDerechosDtoParaEdicion(id) {
				var _url = 'CuentasDefectoDerechos/ObtenerCuentaDefectoDerechosDtoParaEdicion/'+id;
				return DotService.Get(_url);
			}

			function CuentaGuardar(cuenta) {
				var _url = 'CuentasDefectoDerechos/Guardar';
				return DotService.Post(_url, cuenta);
			}

			function SucursalObtenerTodos () {
				var _url = 'Sucursal/ObtenerTodas';
				return DotService.Get(_url,{ isCachable: true });
			}

			function ServicioObtenerTodos () {
				var _url = 'Servicio/ObtenerTodos';
				return DotService.Get(_url);
			}

			function CuentaObtenerPorId (idCuenta) {
				var _url = 'CuentasDefectoDerechos/ObtenerPorId/'+ idCuenta;
				return DotService.Get(_url);
			}

			function CuentaObtenerNuevo (idContrato) {
				var _url = 'CuentasDefectoDerechos/ObtenerNuevo';
				return DotService.Get(_url);
			}
		}
	};

	return module;
})();