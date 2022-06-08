/**
 * @author 			emansilla
 * @description 	description
 */
export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('AutorizacionInternadoNewController', AutorizacionInternadoNewController);

		AutorizacionInternadoNewController.$inject = [
			'$location', 'Logger', '$q', '$state', '$stateParams',
			'ModalService', 'IntervencionDataService', 'AutorizacionInternadoLogicService',
			// Injectado por state
			'Autorizacion', 'EstadosAdmision', 'Internacion',
			'User'
		];

		function AutorizacionInternadoNewController (
			$location,  $log, $q, $state, $stateParams,
			ModalService, IntervencionDataService, AutorizacionInternadoLogicService,
			// Injectado por state
			Autorizacion, EstadosAdmision, Internacion,
			User
		) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('AutorizacionInternadoNewController');
			$log.debug('ON.-');
			
			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			var vm = this;
			vm.tabs = [];
			vm.editable = $state.current.data.editable;
			vm.new = $state.current.data.new;
			vm.user = User;
			vm.today = new Date();
			vm.title = {
			 	icon : $state.current.data.icon,
				page : $state.current.data.title
			};

			vm.data = {
				autorizacion : {},
				estadosAdmision : []
			};

			vm.formData = {
				fechaAutorizacion : ''
			};

			vm.formControl = {
				loading : false,
				error : false,
				reloadPage : activate,
				validar : validarForm,
				save : addAutorizacion,
				volver : volver
			};

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			/* FORMULARIO */

			function validarForm () {
				if (vm.data.autorizacion.cantidad_dias_solicitados > 0)
					return true;

				if (vm.data.autorizacion.DetallesIntervencion && vm.data.autorizacion.DetallesIntervencion.length)
					return true;

				if (vm.data.autorizacion.ProtesisPreadmision && vm.data.autorizacion.ProtesisPreadmision.length)
					return true;

				return false;
			}

			function addAutorizacion () {
				var _autorizacion = AutorizacionInternadoLogicService
					.crearIntervencionAdmision(vm.data.autorizacion, vm.formData, User);
				
				$log.debug('Add ON.-', _autorizacion);

				IntervencionDataService.Add(_autorizacion)
				.then(successCallback);

				function successCallback (pAutorizacion) {
					ModalService.info('Se guardó con éxito');
					volver();
					$log.debug('Add OK.-', pAutorizacion);
				}
			}

			function volver () {
				if ($stateParams.idInternacion)
					$state.go('internado.editSelector', {idInternacion: $stateParams.idInternacion});
				else 
					$state.go('internado.list.all');
			}

			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */

			activate();

			function activate () {
				$log.debug('Inicializar ON.-');

				if ($stateParams.idInternacion) {
					vm.title.page = $state.current.data.title + ($stateParams.idInternacion + 700000);
	 				vm.data.autorizacion = Autorizacion;
	 				vm.data.internacion = Internacion;
	 				vm.data.estadosAdmision = EstadosAdmision;
					
				} else {
					volver();
				}
			}

		}
	};

	return module;

})();