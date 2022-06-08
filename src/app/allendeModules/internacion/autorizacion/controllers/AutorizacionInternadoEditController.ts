/**
 * @author 			emansilla
 * @description 	description
 */
import * as angular from 'angular';

export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('AutorizacionInternadoEditController', AutorizacionInternadoEditController);

		AutorizacionInternadoEditController.$inject = [
			'Logger', '$q', '$state', '$stateParams', 'DateUtils',
			'ModalService', 'IntervencionDataService', 'AutorizacionInternadoLogicService',
			// Inject by state
			'Autorizacion', 'EstadosAdmision', 'Internacion',
			'User'];

		function AutorizacionInternadoEditController (
			$log, $q, $state, $stateParams, DateUtils,
			ModalService, IntervencionDataService, AutorizacionInternadoLogicService,
			// Inject by state
			Autorizacion, EstadosAdmision, Internacion,
			User) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('AutorizacionInternadoEditController');
			$log.debug('ON.-');
			
			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			var vm = this;
			vm.tabs = [];
			vm.editable = true;
			vm.estaAutorizado = $state.current.data.autorizado;
			vm.user = User;
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
				volver : volver,
				update : updateAutorizacion
			};

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			/* FORMULARIO */

			function updateAutorizacion () {
				var _autorizacion = AutorizacionInternadoLogicService
					.crearIntervencionAdmision(vm.data.autorizacion, vm.formData, User);

				$log.debug('Edit ON.-', _autorizacion, angular.toJson(_autorizacion));

				IntervencionDataService.Update(_autorizacion)
				.then(successCallback);

				function successCallback (pAutorizacion) {
					ModalService.info('Se guardó con éxito');
					volver();
					$log.debug('Edit OK.-', pAutorizacion);
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
				$log.debug('Inicializar edit ON.-');
				if ($stateParams.idIntervencion && $stateParams.idInternacion) {
	 				vm.data.autorizacion = Autorizacion;
	 				vm.data.estadosAdmision = EstadosAdmision;
	 				vm.data.internacion = Internacion;
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