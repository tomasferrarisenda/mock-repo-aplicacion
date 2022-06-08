/**
 * @author:			Pedro Ferrer (El campeón)
 * @description:	Diagnostico CIE10
 * @type:			Service
 **/
export default (function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('Cie10DataService', Cie10DataService);

		Cie10DataService.$inject = ['DotService'];
		
		function Cie10DataService (DotService) {
			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */
			const service = {
                ObtenerTodos : ObtenerTodos,
                ObtenerPorCodigo : ObtenerPorCodigo
			};

			return service;

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */
			
			function ObtenerTodos () {
				var _url = 'DiagnosticoCie10Completo/GetParaBusqueda';
				return DotService.Get(_url);
			}

			function ObtenerPorCodigo(codigo) {
				var _url = 'DiagnosticoCie10Completo/ObtenerPorCodigo/'+codigo;
				return DotService.Get(_url);
			}
		}
	};

	return module;
})();