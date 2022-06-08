export default (function () {
	'use strict';

	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.controller('StockPrintController', StockPrintController);

		// Inyección de Dependencia
		StockPrintController.$inject = ['$scope', '$log', 'Ubicacion'];
		// Constructor del Controller
		function StockPrintController($scope, $log, Ubicacion) {

			$log.debug('StockPrintController: ON.-', Ubicacion);

			var vm = this;

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
				aval: {}
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
			}

			/* IMPLEMENTACIÓN DE MÉTODOS*/

			/* FORMULARIO */

			function volver() {
				// body...
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
				if ($scope.constante.ubicacion.DetalleStock.length > 0) {
					setTimeout(function () { window.print(); }, 1000);
				}
				else {
					$scope.formControl.vacio = true;
				}
			};
		};

	}
	return module;

})();