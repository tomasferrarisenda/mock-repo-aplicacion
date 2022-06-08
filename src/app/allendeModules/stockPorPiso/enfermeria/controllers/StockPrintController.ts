export default (function () {
	'use strict';

	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.controller('StockPrintController', StockPrintController);

		// Inyección de Dependencia
		StockPrintController.$inject = ['$scope', '$log', '$uibModalInstance', 'Ubicacion'];

		// Constructor del Controller
		function StockPrintController($scope, $log, $uibModalInstance, Ubicacion) {

			$log.debug('StockPrintController: ON.-', Ubicacion);


			$scope.constante = {
				ubicacion: Ubicacion,
				title: "Detalle de stock actual de "
			};

			$scope.formData = {
				aval: '',
				html: ''
			};

			$scope.data = {
				internacion: {},
				aval: {},
				//user: User// Usuario con rol del modulo
			};

			$scope.formControl = {
				// Manejo del formulario
				error: true,
				loading: false,
				vacio: false,
				reloadPage: activate,
				volver: volver,
				validarForm: validarForm,
				llenarForm: llenarForm,
			};

			$scope.validar = {
				error: validarError
			};

			/* IMPLEMENTACIÓN DE MÉTODOS*/

			/* FORMULARIO */

			function volver() {


			}

			function validarError(pBool) {
				if (!pBool) {
					return 'error';
				}
				return;
			}


			function validarForm() {
				// body...
			}

			function llenarForm() {
				// body...
			}


			activate();
			/* Método inicializador */
			function activate() {
				// $log.debug('AVAL', $scope.formData.aval);
				if ($scope.constante.ubicacion.DetalleStock.length > 0) {
					setTimeout(function () { window.print(); }, 1000);
				}
				else {
					$scope.formControl.vacio = true;
				}
			}
		}

	};
	return module;

})();