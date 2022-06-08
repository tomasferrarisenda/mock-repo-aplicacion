/**
 * @author 			drobledo
 * @description 	States para Profesionales Externos
 */
import profesionalesExternosList = require ("../views/profesionalesExternosList.html");
export default(function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function(module) {

		module.config(states);

		states.$inject = ['$stateProvider', '$urlRouterProvider'];

		function states($stateProvider, $urlRouterProvider) {
			$stateProvider.state(
			{
				name : 'profesionales.profesionalesExternos',
				url : 'ProfesionalesExternos/List',
				template: profesionalesExternosList,
				controller: 'ProfesionalesExternosListController',
				controllerAs: 'vm',
				data : {
					idPermiso: 241
				}
			});
		}
	};

	return module;
})();