/**
 * @author 			jbasiluk
 * @description 	LogicService para Configuracion de Reglas Selección Cta Derecho
 */
import editarRegla = require ('../templates/reglasSeleccionCtaDerecho-edit.tpl.html');

export default (function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function(module) {

		module.factory('ReglasSeleccionCtaDerechoLogicService', ReglasSeleccionCtaDerechoLogicService);

		ReglasSeleccionCtaDerechoLogicService.$inject = ['Logger', '$uibModal'];

		function ReglasSeleccionCtaDerechoLogicService($log, $uibModal) {
			$log = $log.getInstance('ReglasSeleccionCtaDerechoLogicService');
			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			const service = {
				editRegla: editRegla,
			};

			return service;

			function editRegla(idRegla) {
				return $uibModal.open({
					template: editarRegla,
					controller: 'ReglasSeleccionCtaDerechoEditController',
					controllerAs: 'vm',
					keyboard : true,
					size: 'lg',
					resolve: {
						IdReglaEditar: function() {
							return idRegla;
						}
					}
				}).result;
			}
		}
	};
	return module;
})();