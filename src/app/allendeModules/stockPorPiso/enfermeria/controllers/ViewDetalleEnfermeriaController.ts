import { IMovimientoStockDataService, IStockCommonLogicService } from '../../common/services';

export default (function () {
	'use strict';

	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.controller('ViewDetalleEnfermeriaController', ViewDetalleEnfermeriaController);

		ViewDetalleEnfermeriaController.$inject = ['$scope', '$log', '$q', '$uibModalInstance',
			'MovimientoStockDataService', 'StockCommonLogicService',
			'StockEnfermeriaLogicService', 'AlertaService'];

		function ViewDetalleEnfermeriaController($scope, $log, $q, $uibModalInstance,
			MovimientoStockDataService: IMovimientoStockDataService, StockCommonLogicService: IStockCommonLogicService,
			StockEnfermeriaLogicService, AlertaService: IAlertaService) {

			$log.debug('ViewDetalleEnfermeriaController: ON.-');

			/* ------------------------------ API Y VARIABLES ------------------------------ */

			$scope.formData = {
				observacion: '',
				searchEnfermera: '',
				subseccion: ''
			};

			$scope.data = {
				movimientosDetalle: [],
				detallesScrap: [],
				movimiento: '',
				movimientosDetalleFiltrado: [],
				ubicacionScrap: ''

			};

			$scope.formControl = {
				error: true,
				loadingModal: false,
				farmacia: false,
				cancelarDetalle: cancelarDetalle,

				reloadPage: activate,
				ok: close,
				cancel: cancel
			};

			/* ------------------------------ IMPLEMENTACIÓN ------------------------------ */


			function inicializarVariables() {
				$scope.data.movimiento = StockEnfermeriaLogicService.movimiento;
				$scope.formControl.puedeAutorizar = StockEnfermeriaLogicService.puedeAutorizar;
				// $scope.data.materiales = StockEnfermeriaLogicService.materiales;
				// $scope.data.movimientosDetalleFiltrado = $scope.data.movimiento.DetallesMovimiento;
				$log.debug("movimiento", $scope.data.movimiento);
				// $scope.formControl.loadingModal = true;
				$scope.data.ubicacionScrap = '';
				$scope.formControl.observacion = false;
				if ($scope.data.movimiento.UbicacionHasta.scrapEnfermera) {
					// 	UbicacionScrapDataService.getUbicacionScrapEnfermeraByUbicacion($scope.data.movimiento.id_ubicacion_hasta)
					// .then(function (pUbicacionScrap) {
					// 	$log.debug(pUbicacionScrap);
					// 	$scope.data.ubicacionScrap = pUbicacionScrap;
					$scope.formControl.observacion = true;
					// })
				}
				else if ($scope.data.movimiento.UbicacionDesde.tipo_ubicacion == 2) {
					$scope.formControl.farmacia = true;
				}
				// $scope.formControl.loadingModal = false;
				GetMovimientoDetallePorMovimiento($scope.data.movimiento);
			}

			function close() {
				var descartados: Array<any> = [];
				for (var i = 0; i < $scope.data.movimiento.DetallesMovimiento.length; i++) {
					if ($scope.data.movimiento.DetallesMovimiento[i].descartar) {
						descartados.push($scope.data.movimiento.DetallesMovimiento[i]);
					}
				}
				if (descartados.length == 0) {
					$uibModalInstance.close();
				}
				else {
					var array: Array<any> = [];
					for (var i = 0; i < descartados.length; i++) {
						array[i] = MovimientoStockDataService
							.cancelarDetalle(descartados[i].id_movimiento_stock_detalle);
					}
					$q.all(array)
						.then(function () {
							AlertaService.NewSuccess("Detalles Cancelados");
							$uibModalInstance.close();
						}, function () {
							$scope.formControl.loading = false;
						});
				}
			}


			function GetMovimientoDetallePorMovimiento(pMovimiento) {

				$log.debug('ViewDetalleEnfermeriaController: GetMovimientoDetallePorMovimiento ON.-');
				$scope.data.movimiento = pMovimiento;
				if ($scope.formControl.farmacia) {
					MovimientoStockDataService.getMovimientoDetalleComprimidoPorMovimiento(pMovimiento.id_movimiento)
						.then(function (pDetallesMovimiento) {
							$log.debug('ViewDetalleEnfermeriaController: GetMovimientoDetallePorMovimiento OK.-');
							$scope.data.movimiento.DetallesMovimiento = pDetallesMovimiento;
							$scope.data.movimiento = StockCommonLogicService
								.materialesPorMovimiento($scope.data.movimiento, StockEnfermeriaLogicService.materiales);
							// $scope.data.movimientosDetalleFiltrado = $scope.data.movimiento.DetallesMovimiento;
						}, function () {
							$scope.formControl.loading = false;
						});
				}
				else {
					$scope.data.movimiento = StockCommonLogicService
						.materialesPorMovimiento($scope.data.movimiento, StockEnfermeriaLogicService.materiales);
				}

			}

			function cancelarDetalle(i) {
				$scope.data.movimiento.DetallesMovimiento[i].descartar = !$scope.data.movimiento.DetallesMovimiento[i].descartar;
			}

			function cancel() {
				$uibModalInstance.dismiss('cancel');
			}

			/* ------------------------------ ACTIVATE ------------------------------ */

			activate();

			/* Método inicializador */
			function activate() {
				$log.debug('ViewDetalleEnfermeriaController: Inicializar ON.-');
				inicializarVariables();


			}
		}
	};

	return module;
})();