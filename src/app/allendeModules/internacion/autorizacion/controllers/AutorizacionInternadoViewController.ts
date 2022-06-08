/**
 * @author 			emansilla
 * @description 	description
 */
export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('AutorizacionInternadoViewController', AutorizacionInternadoViewController);

		AutorizacionInternadoViewController.$inject = [
			'Logger', '$state', '$stateParams', 'DateUtils',
			// Inject by state
			'Autorizacion', 'EstadosAdmision', 'Internacion',
			'User'];

		function AutorizacionInternadoViewController (
			$log, $state, $stateParams, DateUtils,
			// Inject by state
			Autorizacion, EstadosAdmision, Internacion,
			User) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('AutorizacionInternadoViewController');
			$log.debug('ON.-');
			
			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			var vm = this;
			vm.tabs = [];
			vm.editable = false;
			vm.user = {};
			vm.today = new Date();
			vm.title = {
				icon : $state.current.data.icon,
				page : $state.current.data.title
			};

			vm.data = {
				autorizacion : {},
				internacion : {},
				estadosAdmision : []
			};

			vm.formData = {
				fechaAutorizacion : ''
			};

			vm.formControl = {
				loading : false,
				error : false,
				reloadPage : activate,
				volver : volver
			};

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			/* FORMULARIO */

			function volver () {
				if ($stateParams.idInternacion)
					$state.go('internado.editSelector', { idInternacion : $stateParams.idInternacion });
				else 
					$state.go('internado.list.all');
			}

			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */

			activate();

			function activate () {
				$log.debug('Inicializar ON.-');

				if ($stateParams.idIntervencion && $stateParams.idInternacion) {
	 				vm.data.autorizacion = Autorizacion;
	 				vm.data.estadosAdmision = EstadosAdmision;
	 				vm.data.internacion= Internacion;
	 				vm.title.page = $state.current.data.title + ($stateParams.idInternacion + 700000);
 					vm.formData.fechaAutorizacion = DateUtils.parseToFe(vm.data.autorizacion.fecha_autorizado);
				} else {
					volver();
				}
			}

		}
	};

	return module;

})();