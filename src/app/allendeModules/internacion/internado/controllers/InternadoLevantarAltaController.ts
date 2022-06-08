/**
 * @author 			emansilla
 * @description 	description
 */
export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('InternadoLevantarAltaController', InternadoLevantarAltaController);

		// Inyeccion de dependencia
		InternadoLevantarAltaController.$inject = ['Logger', '$state', 'ModalService', 'AdmisionDataService',
			'User'];
		
		// Constructor del Controller
		function InternadoLevantarAltaController ($log, $state, ModalService, AdmisionDataService,
			User) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('InternadoLevantarAltaController');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */
				
				var vm = this;
				vm.title = {
					icon : $state.current.data.icon,
					page : $state.current.data.title
				};

				vm.formData = {
					numeroInternado: 0,
					sinDatos: 'Sin Datos'
				};

				vm.data = {
					internacion: null
				};

				vm.formControl = {
					error: false,
					loading: false,
					reloadPage: activate,
					volver: volver,
					// valid : validarForm,
					buscarInternado : buscarInternado,
					levantarAlta : levantarAltaInternado,
					goToCenso : goToCenso
				};

 			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			/* FORMULARIO */

			function inicializarVariables () {
				vm.data.internacion = null;
			}

			function volver () {
				$state.go('internado.list.all.censo');
			}

			/* INTERNACION */

			function buscarInternado () {

				AdmisionDataService.getOneForLevantarAlta(vm.formData.numeroInternado)
				.then(buscarInternadoOk, buscarInternadoError);

				function buscarInternadoOk (pInternacion) {
					vm.data.internacion = pInternacion;
				}

				function buscarInternadoError (pError) {
					vm.data.internacion = null;
				}
			}

			function levantarAltaInternado () {
				AdmisionDataService.levantarAlta(vm.data.internacion.id_internacion)
				.then(levantarAltaInternadoOk, levantarAltaInternadoError);

				function levantarAltaInternadoOk () {
					ModalService.success('Se levantó el alta exitosamente.');
				}

				function levantarAltaInternadoError (pError) {
					vm.data.internacion = null;
					ModalService.error(pError.message);
				}
			}

			function goToCenso () {
				$state.go('internado.list.all.censo');
			}

			/* -------------------------------------------- ACTIVATE -------------------------------------------- */

			activate();

			/* Método inicializador */
			function activate () {
				$log.debug('Inicializar OK.-');
				inicializarVariables();
			}
		}

	};

	return module;

})();