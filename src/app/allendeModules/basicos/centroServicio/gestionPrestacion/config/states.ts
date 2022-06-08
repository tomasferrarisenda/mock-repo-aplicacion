/**
 * @author 			ppautasso
 * @description 	description
 */
import centroServicioGestionTemplate = require('../views/centro-servicio.html');

export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.config(states);

		states.$inject = ['$stateProvider', '$urlRouterProvider'];

		function states ($stateProvider, $urlRouterProvider)
		{
			$urlRouterProvider.when('/Basicos/CentroServicios/GestionPrestacion', '/Basicos/CentroServicios/GestionPrestacion/Home');

			$stateProvider.state({
				name : 'centroservicio.gestionprestacion',
				url : '/GestionPrestacion',
				template : '<ui-view><sa-loading></sa-loading></ui-view>'
			});

			$stateProvider.state({
				name : 'centroservicio.gestionprestacion.home',
				url : '/Home',
				template: centroServicioGestionTemplate,
				controller: 'CentroServicioController',
				controllerAs: 'vm',
				data : {
					idPermiso: 220,
					title : 'Gestion de servicios y relaciones con prestaciones',
					module: 'CENTRO DE SERVICIOS - PRESTACIONES'
				}
			});

		
		}
	};

	return module;

})();