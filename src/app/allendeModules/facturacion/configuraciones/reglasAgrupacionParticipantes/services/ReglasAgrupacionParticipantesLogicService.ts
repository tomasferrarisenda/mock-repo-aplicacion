/**
 * @author 			jbasiluk
 * @description 	LogicService para Configuracion de Reglas Agrupación de Participantes
 */
import editarRegla = require ('../templates/reglasAgrupacionParticipantes-edit.tpl.html');

export default (function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function(module) {

		module.factory('ReglasAgrupacionParticipantesLogicService', ReglasAgrupacionParticipantesLogicService);

		ReglasAgrupacionParticipantesLogicService.$inject = ['Logger', '$uibModal'];

		function ReglasAgrupacionParticipantesLogicService($log, $uibModal) {
			$log = $log.getInstance('ReglasAgrupacionParticipantesLogicService');
			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			const service = {
				editRegla: editRegla,
			};

			return service;

			function editRegla(idRegla) {
				return $uibModal.open({
					template: editarRegla,
					controller: 'ReglasAgrupacionParticipantesEditController',
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