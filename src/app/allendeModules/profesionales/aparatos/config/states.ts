/**
 * @author 			XX
 * @description 	Aparatos
 */
import aparatosListado = require('../views/listadoAparatos.html');
import aparatoEdicion = require('../views/aparatoEdit.html');
import aparatoGeneral = require('../views/tabs/aparatoGeneral.html');
import aparatoProfesional = require('../views/tabs/aparatoProfesional.html');
import aparatoProfesionalAtencion = require('../views/tabs/aparatoProfesionalAtencion.html');


export default (function () {
	const module = { init : (ngModule: any) => {} };

	module.init = function(module) {

		module.config(states);

		states.$inject = ['$stateProvider', '$urlRouterProvider'];

		function states($stateProvider, $urlRouterProvider) {

			$urlRouterProvider.when('/Profesionales/Aparatos', '/Profesionales/Aparatos/List');

			$stateProvider.state({
				name: 'profesionales.aparatos',
				url:'/Aparatos',
				template: '<ui-view/>'
			});

			$stateProvider.state('profesionales.aparatos.list', {
				url: '/List',
				template: aparatosListado,
				controller: 'AparatosListController',
				controllerAs: 'vm',
				data: {
					idPermiso: 228
				}
			});

			$stateProvider.state('profesionales.aparatos.edit', {
				url: '/Edit',
				template: aparatoEdicion,
				controller: 'AparatoEditController',
				controllerAs: 'vm',
				data: {
					idPermiso: 228
				},
				params: {
					idAparato : null
				}
			});

				$stateProvider.state(
				{
					name : 'profesionales.aparatos.edit.general',
					url : '/General',
					template: aparatoGeneral,
					controller: 'AparatoGeneralController',
					controllerAs: 'vm',
					data : {
						idPermiso: 228,
					}
				});
				
				$stateProvider.state(
				{
					name : 'profesionales.aparatos.edit.profesional',
					url : '/Profesionales',
					template: aparatoProfesional,
					controller: 'AparatoProfesionalController',
					controllerAs: 'vm',
					data : {
						idPermiso: 228,
					}
				});

				$stateProvider.state(
					{
						name : 'profesionales.aparatos.edit.profesionalAtencion',
						url : '/ProfesionalAtencion',
						template: aparatoProfesionalAtencion,
						controller: 'AparatoProfesionalAtencionController',
						controllerAs: 'vm',
						data : {
							idPermiso: 228,
						}
					});
		}
	};

	return module;
})();