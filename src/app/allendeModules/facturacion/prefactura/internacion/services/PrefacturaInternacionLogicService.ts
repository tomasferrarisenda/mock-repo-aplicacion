export default (function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('PrefacturaInternacionLogicService', PrefacturaInternacionLogicService);

		// Inyección de dependencia
		PrefacturaInternacionLogicService.$inject = ['$log'];

		// Definición del servicio
		function PrefacturaInternacionLogicService ($log) {

			$log.debug('PrefacturaInternacionLogicService: ON.-');
			
			// API o Interface
			const service = {
			};
			return service;
		}
	};
	return module;
})();