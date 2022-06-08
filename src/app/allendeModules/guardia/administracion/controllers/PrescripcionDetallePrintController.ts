import * as angular from 'angular';

export default (function () {
	'use strict';
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('PrescripcionDetallePrintController', PrescripcionDetallePrintController);

		// Inyección de Dependencia
		PrescripcionDetallePrintController.$inject = ['$scope', '$log', '$q', '$uibModalInstance', 'GuardiaAdministracionDataService', 'Prescripcion'];

		// Constructor del Controller
		function PrescripcionDetallePrintController ($scope, $log, $q, $uibModalInstance, GuardiaAdministracionDataService, Prescripcion) {

			$log.debug('PrescripcionDetallePrintController: ON.-');

			var vm = this;

			$scope.constante = {
			};

			$scope.formData = {
				aval : '',
				html : ''
			};

			$scope.data = {
				prescripcion : Prescripcion,
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
			}

			/* IMPLEMENTACIÓN DE MÉTODOS*/

			/* FORMULARIO */

			function volver () {
				

			}

			// function validarError (pBool) {
			// 	if(!pBool) {
			// 		return 'error';
			// 	}
			// }


			function validarForm () {
				// body...
			}

			function llenarForm () {
				// body...
			}


			activate();
			/* Método inicializador */
			function activate () {
				GuardiaAdministracionDataService.getFirmaMedico($scope.data.prescripcion.MatriculaAlta)
					.then(function (pFirma) {
						$scope.data.firmaMedico = 'data:image/jpeg;base64,' + pFirma.Stream;
					})

				// $log.debug('AVAL', $scope.formData.aval);
				 setTimeout(function (){ window.print(); }, 1000);
			};
		};

	}
	return module;
	
})();