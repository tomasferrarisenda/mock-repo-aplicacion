/**
 * @author:			Ezequiel Mansilla
 * @description:	Controller de pruebas
 * @type:			Controller
 **/
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('TestController', TestController);

		TestController.$inject = ['Logger', '$state', 'ModalService', 'User'];

		function TestController ($log, $state, ModalService, User) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('TestController');
			$log.debug('ON.-');
			
			/* ----------------------------------------- API Y VARIABLESES ----------------------------------------- */

			var vm = this;
			vm.today = new Date();
			
			vm.title = {
				name : $state.current.data.title,
				icon : $state.current.data.icon
			};

			vm.functionPrueba = functionPrueba;
			vm.mapFunction = mapFunction;
			
			vm.formControl = {		
				reloadPage : reloadPage,
				volver : volver
			};

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			/* FORMULARIO */

			function reloadPage () {
				$state.reload();
			}

			function volver () {
				$state.go('home');
			}

			function functionPrueba() {
				$log.debug('functionPrueba');
			}

			function mapFunction(pResult) {
				if (!pResult) return;
				return pResult.Rows;
			}

			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */

			activate();

			function activate () {
				$log.debug('Inicializar ON.-');
			}

		}
	};

	return module;

})();