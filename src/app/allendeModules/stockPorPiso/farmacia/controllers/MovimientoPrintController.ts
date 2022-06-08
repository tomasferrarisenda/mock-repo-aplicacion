import { IMovimientoStockDataService, IStockCommonLogicService } from '../../common/services';

export default (function () {
	'use strict';

	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.controller('MovimientoPrintController', MovimientoPrintController);

		// Inyección de Dependencia
		MovimientoPrintController.$inject = ['$scope', '$log',
			'MovimientoStockDataService', 'StockCommonLogicService',
			'StockFarmaciaLogicService', 'Movimiento'];
		// Constructor del Controller
		function MovimientoPrintController($scope, $log,
			MovimientoStockDataService: IMovimientoStockDataService, StockCommonLogicService: IStockCommonLogicService,
			StockFarmaciaLogicService, Movimiento) {

			$log.debug('MovimientoPrintController: ON.-');

			$scope.constante = {
				movimiento: Movimiento
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
				reloadPage: activate,
				volver: volver,
				validarForm: validarForm,
				llenarForm: llenarForm,
				esValidoParaFirma: esValidoParaFirma
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

			function esValidoParaFirma(pIndex) {
				if (pIndex == 2 || pIndex == 8) {
					return true;
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

				$log.debug('ViewDetalleController: GetMovimientoDetallePorMovimiento ON.-');
				MovimientoStockDataService.getMovimientoDetalleComprimidoPorMovimiento($scope.constante.movimiento.id_movimiento)
					.then(function (pDetallesMovimiento) {
						$scope.constante.movimiento.DetallesMovimiento = pDetallesMovimiento;
						$scope.constante.movimiento = StockCommonLogicService
							.materialesPorMovimiento($scope.constante.movimiento, StockFarmaciaLogicService.materiales);
						$log.debug('ViewDetalleController: GetMovimientoDetallePorMovimiento OK.-', $scope.constante.movimiento);
						setTimeout(function () { window.print(); }, 1000);
						// $scope.data.movimientosDetalleFiltrado = $scope.data.movimiento.DetallesMovimiento;
					}, function () {
						$scope.formControl.loading = false;
					});
			}
		}

	};
	return module;

})();