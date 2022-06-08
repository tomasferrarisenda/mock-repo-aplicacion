/**
 * @author 			jbasiluk
 * @description 	DataService para Configuracion de Reglas Agrupación de Participantes
 */

export default (function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('ReglasAgrupacionParticipantesDataService', ReglasAgrupacionParticipantesDataService);

		ReglasAgrupacionParticipantesDataService.$inject = ['DotService'];
		
		function ReglasAgrupacionParticipantesDataService (DotService) {

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
                TipoAgrupacionSeleccionObtenerTodos : TipoAgrupacionSeleccionObtenerTodos
			};

			return service;

			/* ------------------------------ IMPLEMENTACIÓN ------------------------------ */

			function ReglaEliminar(id) {
				var _url = 'ReglaAgrupacionParticipantes/Eliminar/' + id;
				return DotService.Get(_url);
			}

			function ObtenerListadoReglas(filtroDto) {
				var _url = 'ReglaAgrupacionParticipantes/ObtenerPorFiltro';
				return DotService.Post(_url, filtroDto);
			}

			function ObtenerFiltroReglas() {
				var _url = 'ReglaAgrupacionParticipantes/ObtenerFiltroRegla';
				return DotService.Get(_url);
			}

			function ObtenerReglaDtoParaEdicion(id) {
				var _url = 'ReglaAgrupacionParticipantes/ObtenerReglaParaEdicion/'+id;
				return DotService.Get(_url);
			}

			function ReglaGuardar(cuenta) {
				var _url = 'ReglaAgrupacionParticipantes/Guardar';
				return DotService.Post(_url, cuenta);
			}

			function SucursalObtenerTodos () {
				var _url = 'Sucursal/ObtenerTodas';
				return DotService.Get(_url);
			}

			function ServicioObtenerTodos () {
				var _url = 'Servicio/ObtenerTodos';
				return DotService.Get(_url);
            }
            
            function TipoAgrupacionSeleccionObtenerTodos () {
                var _url = 'TipoAgrupacionParticipantes/ObtenerTodos';
				return DotService.Get(_url, { isCachable: true });
            }

			function ReglaObtenerPorId (idCuenta) {
				var _url = 'ReglaAgrupacionParticipantes/ObtenerPorId/'+ idCuenta;
				return DotService.Get(_url);
			}

			function ReglaObtenerNuevo (idContrato) {
				var _url = 'ReglaAgrupacionParticipantes/ObtenerNuevo';
				return DotService.Get(_url);
			}
		}
	};

	return module;
})();