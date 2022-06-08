/**
 * @author:			Ezequiel Mansilla
 * @description:	Reporte de flujo de camas
 * @type:			Controller
 **/
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('InternacionFlujoCamasController', InternacionFlujoCamasController);

		InternacionFlujoCamasController.$inject = ['Logger', '$filter', '$state', '$stateParams', 'ModalService',
			'Reporte', 'User'];

		function InternacionFlujoCamasController ($log, $filter, $state, $stateParams, ModalService,
			Reporte, User) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('InternacionFlujoCamasController');
			$log.debug('ON.-');
			
			/* ----------------------------------------- API Y VARIABLESES ----------------------------------------- */

			var vm = this;
			
			vm.title = {
				name : $state.current.data.title,
				icon : $state.current.data.icon
			};

			vm.data = {
				reporte : []
			};

			vm.filter = {
			};

			vm.formControl = {
				reloadPage : reloadPage
			};

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			/* FORMULARIO */

			function reloadPage () {
				var fecha = $filter('date')(vm.filter.fechaAdmision, 'MM-dd-yyyy');

				$state.go($state.current.name, {
					fechaAdmisionProbable : fecha
				});
			}

			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */

			activate();

			function activate () {
				$log.debug('Inicializar ON.-', $stateParams);

				vm.data.reporte = Reporte;
				if ($stateParams.fechaAdmisionProbable)
					vm.filter.fechaAdmision = new Date($stateParams.fechaAdmisionProbable);
				else {
					vm.filter.fechaAdmision = new Date();
				}
				$log.debug('Inicializar OK.-');
			}

		}
	};

	return module;

})();