/**
 * @author 			jbasiluk
 * @description 	DataService para Configuracion de Reglas Selección Cta Derecho
 */

export default (function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('ReglasSeleccionCtaDerechoDataService', ReglasSeleccionCtaDerechoDataService);

		ReglasSeleccionCtaDerechoDataService.$inject = ['DotService'];
		
		function ReglasSeleccionCtaDerechoDataService (DotService) {

			/* ------------------------------ API Y VARIABLES ------------------------------ */

			const service = {
				ReglaEliminar : ReglaEliminar,
				ObtenerListadoReglas : ObtenerListadoReglas,
				ObtenerFiltroReglas : ObtenerFiltroReglas,
				ObtenerReglaDtoParaEdicion : ObtenerReglaDtoParaEdicion,
				ReglaGuardar : ReglaGuardar,
				SucursalObtenerTodos : SucursalObtenerTodos,
				ServicioObtenerTodos : ServicioObtenerTodos,
				ReglaObtenerPorId : ReglaObtenerPorId,
                ReglaObtenerNuevo : ReglaObtenerNuevo,
                TipoReglaSeleccionObtenerTodos : TipoReglaSeleccionObtenerTodos
			};

			return service;

			/* ------------------------------ IMPLEMENTACIÓN ------------------------------ */

			function ReglaEliminar(id) {
				var _url = 'ReglaSeleccionCuentaDerecho/Eliminar/' + id;
				return DotService.Get(_url);
			}

			function ObtenerListadoReglas(filtroDto) {
				var _url = 'ReglaSeleccionCuentaDerecho/ObtenerPorFiltro';
				return DotService.Post(_url, filtroDto);
			}

			function ObtenerFiltroReglas() {
				var _url = 'ReglaSeleccionCuentaDerecho/ObtenerFiltroRegla';
				return DotService.Get(_url);
			}

			function ObtenerReglaDtoParaEdicion(id) {
				var _url = 'ReglaSeleccionCuentaDerecho/ObtenerReglaParaEdicion/'+id;
				return DotService.Get(_url);
			}

			function ReglaGuardar(cuenta) {
				var _url = 'ReglaSeleccionCuentaDerecho/Guardar';
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
            
            function TipoReglaSeleccionObtenerTodos () {
                var _url = 'TipoReglaSeleccionCuentaDerecho/ObtenerTodos';
				return DotService.Get(_url, { isCachable: true });
            }

			function ReglaObtenerPorId (idCuenta) {
				var _url = 'ReglaSeleccionCuentaDerecho/ObtenerPorId/'+ idCuenta;
				return DotService.Get(_url);
			}

			function ReglaObtenerNuevo (idContrato) {
				var _url = 'ReglaSeleccionCuentaDerecho/ObtenerNuevo';
				return DotService.Get(_url);
			}
		}
	};

	return module;
})();