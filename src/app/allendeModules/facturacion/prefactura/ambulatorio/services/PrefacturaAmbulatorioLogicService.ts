/**
 * @author:			Pedro Ferrer
 * @description:	Logica de Prefactura Ambulatorio
 * @type:			Service
 **/

export default (function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('PrefacturaAmbulatorioLogicService', PrefacturaAmbulatorioLogicService);

		PrefacturaAmbulatorioLogicService.$inject = ['Logger', '$uibModal'];
		
		function PrefacturaAmbulatorioLogicService ($log, $uibModal) {

			$log = $log.getInstance('PrefacturaAmbulatorioLogicService');

			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			const service = {
				editaritemPrefactura: editaritemPrefactura,
				validarCscEnPrefactura: validarCscEnPrefactura
			};

			return service;
			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			function editaritemPrefactura(item) {
				 return $uibModal.open({
				 	component: 'saprefacturaEditarItem',
				 	size: 'lg',
				 	resolve: {
				 		item: item,
				 	}
				 }).result;
			}

			function validarCscEnPrefactura() {
				return $uibModal.open({
					component: 'saValidarCscEnPrefacturaModal',
					keyboard: false,
					backdrop: 'static',
					size: 'xs',
					resolve: {
					}
				}).result;
		   }

		}


	};

	return module;
})();