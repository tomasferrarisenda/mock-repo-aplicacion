/**
 * @author 			mastore
 * @description 	description
 */
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('CuestionarioRealizarController', CuestionarioRealizarController);

		// Inyeccion de dependencia
		CuestionarioRealizarController.$inject = ['Logger', '$q', '$filter', '$location', '$state', '$stateParams'];
		
		// Constructor del Controller
		function CuestionarioRealizarController ($log, $q, $filter, $location, $state, $stateParams) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('CuestionarioRealizarController');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */
				
			var vm = this;

			vm.title = {
				page: $state.current.data.title
			};


			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */



			/* -------------------------------------------- ACTIVATE -------------------------------------------- */

			activate();

			function activate () {
				$log.debug('Inicializar ON.-');

				vm.cuestionario = {
					tipoCuestionario: $stateParams.tipoCuestionario
				};

				$log.debug('vm.cuestionario.tipoCuestionario',vm.cuestionario.tipoCuestionario);
				switch (vm.cuestionario.tipoCuestionario)
				{
					case 2:
						vm.cuestionario.idEntidad = $stateParams.clavePaciente;
						vm.cuestionario.idTipoEntidad = 1;
				}

			}

			function activateOk (results) {


			}

			function activateError (pError) {
				vm.formControl.loading = false;
				$log.error('Inicializar ERROR.-', pError);
			}
		}

	};

	return module;

})();