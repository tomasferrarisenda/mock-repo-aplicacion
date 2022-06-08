/**
 * @author 			emansilla
 * @description 	description
 */
export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('InternadoAltaController', InternadoAltaController);

		// Inyección de Dependencia
		InternadoAltaController.$inject = ['Logger', '$scope', '$q', '$filter', '$uibModalInstance',
			'AdmisionDataService', 'InternacionCommonDataService',
			'User', 'IdInternacion'];

		// Constructor del Controller
		function InternadoAltaController ($log, $scope, $q, $filter, $uibModalInstance,
			AdmisionDataService, InternacionCommonDataService,
			User, IdInternacion) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('InternadoAltaController');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------- */

			var vm = this;

			vm.today = new Date();

			vm.formData = {
				tipoAlta : '',
				fechaAlta : new Date(),
				horaAlta : new Date(),
				fechaAdmision : ''
			};

			vm.data = {
				internacion : {},
				tiposAlta : [],
				user : User
			};

			vm.formControl = {
				// Manejo del formulario
				error: true,
				loading: false,
				horaAltaMax : new Date(),
				ok: ok,
				cancel : cancel
			};

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			/* FORMULARIO */


			function validarForm () {
				// body...
			}

			function llenarForm () {
				// body...
			}

			function crearInternacion (pInternacion) {
				var internacion = pInternacion;

				internacion.TipoAfiliado = null;
				internacion.Paciente = null;
				internacion.Intervenciones = null;
				internacion.IntervencionAdmision = null;
				
				vm.formData.fechaAlta.setHours(vm.formData.horaAlta.getHours());
				vm.formData.fechaAlta.setMinutes(vm.formData.horaAlta.getMinutes());
				internacion.fecha_alta_administrativa = $filter('date')(vm.formData.fechaAlta, 'MM/dd/yyyy HH:mm');
				

				return internacion;
			}

			function ok () {
				
				vm.data.internacion.usuario_alta_administrativa = User.userName;

				var internacion = crearInternacion(vm.data.internacion);

				AdmisionDataService.altaPaciente(internacion)
				.then(function (pAlgo) {
					$uibModalInstance.close('ok');
				}, function (pError) {
					$uibModalInstance.dismiss(pError);
				});
			}

			function cancel () {
				$uibModalInstance.dismiss('cancel');
			}

			$scope.$watch(function () {
				if (vm.formData && vm.formData.fechaAlta)
					return vm.formData.fechaAlta;
				else
					return '';
			}, function (newVal) {
				$log.debug('cambio fecha alta');
				var today = $filter('date')(new Date(), 'dd/MM/yyyy'),
					fechaAlta = $filter('date')(newVal, 'dd/MM/yyyy');

				if (today != fechaAlta) {
					$log.debug('cabio fecha alta distintas');
					vm.formControl.horaAltaMax = new Date();
					vm.formControl.horaAltaMax.setHours(23);
					vm.formControl.horaAltaMax.setMinutes(59);
					$log.debug('cabio fecha alta distintas', vm.formControl.horaAltaMax);
				} else {
					$log.debug('cabio fecha alta iguales');
					vm.formControl.horaAltaMax = new Date();
				}
			});

			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */

			activate();
			
			function activate () {
				vm.formControl.loading = true;
				$log.debug('Inicializar ON.-');
				var _internacion = AdmisionDataService.getOneInternacion(IdInternacion);
				var _tipoAlta = InternacionCommonDataService.getAllTipoAlta();
				$q.all([_internacion, _tipoAlta])
				.then(activateOk, activateError);
			}

			function activateOk (pResults) {
				vm.formControl.loading = false;
				vm.data.internacion = pResults[0];
				vm.data.tiposAlta = pResults[1];

				vm.formData.fechaAdmision = new Date(vm.data.internacion.fecha_admision);
				$log.debug('Inicializar OK.-');
			}

			function activateError (pError) {
				$uibModalInstance.dismiss(pError);
			}
		};
	};

	return module;

})();