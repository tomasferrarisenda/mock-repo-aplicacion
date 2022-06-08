import * as angular from 'angular';

export default (function () {
	'use strict';
	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.controller('FojaGuardiaPrintController', FojaGuardiaPrintController);

		// Inyección de Dependencia
		FojaGuardiaPrintController.$inject = ['$scope', '$log', '$q', '$uibModalInstance',
			'GuardiaAdministracionDataService', 'Detalle', 'Prescripcion'];

		// Constructor del Controller
		function FojaGuardiaPrintController($scope, $log, $q, $uibModalInstance,
			GuardiaAdministracionDataService, Detalle, Prescripcion) {

			$log.debug('FojaGuardiaPrintController: ON.-');

			// var vm = this;

			$scope.constante = {
			};

			$scope.formData = {
				// aval : '',
				// html : ''
			};

			$scope.data = {
				detalle: Detalle,
				prescripcion: Prescripcion,
				firmaMedico: ''
				//user: User// Usuario con rol del modulo
			};

			$scope.formControl = {
				// Manejo del formulario
				error: true,
				loading: false,
				reloadPage: activate,
				volver: volver,
				validarForm: validarForm,
				llenarForm: llenarForm,
			};

			$scope.validar = {
				// error: validarError
			};

			/* IMPLEMENTACIÓN DE MÉTODOS*/

			/* FORMULARIO */

			function volver() {


			}

			// function validarError(pBool) {
			// 	if (!pBool) {
			// 		return 'error';
			// 	}
			// }


			function validarForm() {
				// body...
			}

			function llenarForm() {
				// body...
			}


			activate();
			/* Método inicializador */
			function activate() {
				GuardiaAdministracionDataService.getFirmaMedico($scope.data.prescripcion.MatriculaAlta)
					.then(function (pFirma) {
						$scope.data.firmaMedico = 'data:image/jpeg;base64,' + pFirma.Stream;
						setTimeout(function () { window.print(); }, 1000);
					}, function () {
						// body...
						setTimeout(function () { window.print(); }, 1000);
					});

				// $log.debug('AVAL', $scope.formData.aval);
			}
		}

	};
	return module;

})();