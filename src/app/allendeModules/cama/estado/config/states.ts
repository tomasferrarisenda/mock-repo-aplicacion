/**
 * @author 			emansilla
 * @description 	description
 */
import camaListTemplate = require('../views/cama-states-list.html');
export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.config(routes);

		routes.$inject = ['$stateProvider', '$urlRouterProvider', 'ACTION_CAMA'];

		function routes ($stateProvider, $urlRouterProvider)
		{
			$urlRouterProvider.when('/Cama/Estados', '/Cama/Estados/List/All');

			$stateProvider.state({
				name : 'cama.estado',
				url : '/Estados',
				template : '<ui-view><sa-loading><sa/loading></ui-view>'
			});
			
			EstadosCama.$inject = ['CamaDataService'];
			function EstadosCama (CamaDataService) {
				return CamaDataService.getAllEstadosCama();
			}

			CategoriasHabitacion.$inject = ['CamaDataService'];
			function CategoriasHabitacion (CamaDataService) {
				return CamaDataService.getAllCategoriasHabitacion();
			}

			Camas.$inject = ['CamaDataService'];
			function Camas (CamaDataService) {
				// return CamaDataService.getAllCategoriasHabitacion();
			}

			$stateProvider.state({
				name : 'cama.estado.list',
				url : '/List',
				template: camaListTemplate,
				controller: 'CamaStateListController',
				controllerAs: 'vm',
				resolve : {
					EstadosCama : EstadosCama,
					CategoriasHabitacion : CategoriasHabitacion
				}
			});

			$stateProvider.state({
				name : 'cama.estado.list.all',
				url : '/All',
				data : {
					title : 'Lista de todas las cama',
					icon : '',
					all : true,
					idPermiso : 74
				}
			});

			$stateProvider.state({
				name : 'cama.estado.list.mantenimiento',
				url : '/Mantenimiento',
				data : {
					title : 'Lista de camas para mantenimiento',
					icon : '',
					all : false,
					headerIf : false,
					idPermiso : 73
				}
			});

			$stateProvider.state({
				name : 'cama.estado.list.limpieza',
				url : '/Limpieza',
				data : {
					title : 'Lista de camas para limpieza',
					icon : '',
					all : false,
					headerIf : false,
					idPermiso : 72
				}
			});
		}
	};

	return module;

})();