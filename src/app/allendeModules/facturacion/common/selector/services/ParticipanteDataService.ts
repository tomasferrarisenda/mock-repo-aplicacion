/**
 * @author:			Pedro Ferrer (El campeón)
 * @description:	Participante
 * @type:			Service
 **/
export default (function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('ParticipanteDataService', ParticipanteDataService);

		ParticipanteDataService.$inject = ['DotService'];
		
		function ParticipanteDataService (DotService) {
			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */
			const service = {
                obtenerTodosComponentesCompleto
			};

			return service;

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */
			function obtenerTodosComponentesCompleto(){
				var _url = 'TipoComponente/ObtenerTodosCompleto';
				return DotService.Get(_url, { isCachable: true });
			}

			// function ObtenerTodos () {
			// 	var _url = 'DiagnosticoCie10Completo/GetParaBusqueda';
			// 	return DotService.Get(_url);
			// }

			// function ObtenerPorCodigo(codigo) {
			// 	var _url = 'DiagnosticoCie10Completo/ObtenerPorCodigo/'+codigo;
			// 	return DotService.Get(_url);
			// }
		}
	};

	return module;
})();