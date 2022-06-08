export default (function () {
	'use strict';

	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.factory('StockFarmaciaStorageService', StockFarmaciaStorageService);
		
		StockFarmaciaStorageService.$inject = ['DotService', 'AuthorizationService', '$log'];
		function StockFarmaciaStorageService(DotService, AuthorizationService, $log) {
			$log.info('StockFarmaciaStorageService: ON.-');

			// TODO: Ver que se usa un producto o articulo o algo.
			var usuario = '';
			var user = '';
			var movimiento = '';
			var ubicacion = '';
			var ubicacionDetalle = '';
			var ubicacionesDetalle = [];
			var internacion = '';
			var internaciones = '';
			var movimientosDetalleCargados = [];
			var ubicacionHasta = '';
			var ubicacion = '';
			var print = false;

			// API o Interface
			const service = {
				
			};
			
			return service;
		}
	};

	return module;
})(); 