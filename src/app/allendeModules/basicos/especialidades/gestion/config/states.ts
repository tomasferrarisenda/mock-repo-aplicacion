/**
 * @author 			ppautasso
 * @description 	description
 */
import especialidadGestionListTemplate = require('../views/especialidad-gestion-list.html');
export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function(module) {

		module.config(states);

		states.$inject = ['$stateProvider', '$urlRouterProvider'];

		function states($stateProvider, $urlRouterProvider) {

			$urlRouterProvider.when('/Basicos/Especialidades/Gestion', '/Basicos/Especialidades/Gestion/List');			
			
			$stateProvider.state({
				name : 'especialidades.gestion',
				url : '/Gestion',
				template : '<ui-view><sa-loading></sa-loading></ui-view>'
			});

		$stateProvider.state({
				name: 'especialidades.gestion.list',
				url: '/List',
				template: especialidadGestionListTemplate,
				controller: 'EspecialidadesGestionListController',
				controllerAs: 'vm',
				data: {
					idPermiso: 223,
					title: 'Gestion de todos los Servicios',
					icon: 'LIST'
				}
			});
		}
	};

	return module;

})();