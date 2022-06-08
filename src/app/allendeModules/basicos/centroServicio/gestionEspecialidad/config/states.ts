/**
 * @author 			ppautasso
 * @description 	description
 */
import centroServicioGestionTemplate = require('../views/centro-servicio-especialidad.html');

export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.config(states);

		states.$inject = ['$stateProvider', '$urlRouterProvider'];

		function states ($stateProvider, $urlRouterProvider)
		{
			$urlRouterProvider.when('/Basicos/CentroServicios/GestionEspecialidad', '/Basicos/CentroServicios/GestionEspecialidad/Home');

			$stateProvider.state({
				name : 'centroservicio.gestionespecialidad',
				url : '/GestionEspecialidad',
				template : '<ui-view><sa-loading></sa-loading></ui-view>'
			});

			$stateProvider.state({
				name : 'centroservicio.gestionespecialidad.home',
				url : '/Home',
				template: centroServicioGestionTemplate,
				controller: 'CentroServicioEspecialidadController',
				controllerAs: 'vm',
				data : {
					idPermiso: 221,
					title : 'Gestion de servicios y relaciones con especialidades'
				}
			});

		
		}
	};

	return module;

})();