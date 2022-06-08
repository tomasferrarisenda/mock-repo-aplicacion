/**
 * @author 			jbasiluk
 * @description 	States para Configuracion de Reglas Agrupación de Participantes
 */
import reglasAgrupacionParticipantesList = require ("../views/reglasAgrupacionParticipantesList.html");
export default(function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function(module) {

		module.config(states);

		states.$inject = ['$stateProvider', '$urlRouterProvider'];

		function states($stateProvider, $urlRouterProvider) {


			$stateProvider.state(
			{
				name : 'facturacion.configuraciones.reglaAgrupacionParticipantes',
				url : 'ReglasAgrupacionParticipantes/List',
				template: reglasAgrupacionParticipantesList,
				controller: 'ReglasAgrupacionParticipantesListController',
				controllerAs: 'vm',
				data : {
					idPermiso: 289
				}
			});
		}
	};

	return module;
})();