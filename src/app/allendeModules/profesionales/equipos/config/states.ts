/**
 * @author 			XX
 * @description 	Equipos
 */
import equiposListado = require('../views/listadoEquipos.html');
import equipoEdicion = require('../views/equipoEdit.html');
import equipoGeneral = require('../views/tabs/equipoGeneral.html');
import equipoProfesional = require('../views/tabs/equipoProfesional.html');
import equipoProfesionalAtencion = require('../views/tabs/equipoProfesionalAtencion.html');

export default (function () {
	const module = { init : (ngModule: any) => {} };

	module.init = function(module) {

		module.config(states);

		states.$inject = ['$stateProvider', '$urlRouterProvider'];

		function states($stateProvider, $urlRouterProvider) {

			$urlRouterProvider.when('/Profesionales/Equipos', '/Profesionales/Equipos/List');

			$stateProvider.state({
				name: 'profesionales.equipos',
				url:'/Equipos',
				template: '<ui-view/>'
			});

			$stateProvider.state('profesionales.equipos.list', {
				url: '/List',
				template: equiposListado,
				controller: 'EquiposListController',
				controllerAs: 'vm',
				data: {
					idPermiso: 228
				}
			});

			$stateProvider.state('profesionales.equipos.edit', {
				url: '/Edit',
				template: equipoEdicion,
				controller: 'EquipoEditController',
				controllerAs: 'vm',
				data: {
					idPermiso: 228
				},
				params: {
					idEquipo : null
				}
			});

				$stateProvider.state(
				{
					name : 'profesionales.equipos.edit.general',
					url : '/General',
					template: equipoGeneral,
					controller: 'EquipoGeneralController',
					controllerAs: 'vm',
					data : {
						idPermiso: 228,
					}
				});
				
				$stateProvider.state(
				{
					name : 'profesionales.equipos.edit.profesional',
					url : '/Profesionales',
					template: equipoProfesional,
					controller: 'EquipoProfesionalController',
					controllerAs: 'vm',
					data : {
						idPermiso: 228,
					}
				});

				$stateProvider.state(
					{
						name : 'profesionales.equipos.edit.profesionalAtencion',
						url : '/ProfesionalAtencion',
						template: equipoProfesionalAtencion,
						controller: 'EquipoProfesionalAtencionController',
						controllerAs: 'vm',
						data : {
							idPermiso: 228,
						}
					});
		}
	};

	return module;
})();