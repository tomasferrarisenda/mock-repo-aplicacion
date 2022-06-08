import { IMovimientoStockDataService, IUbicacionScrapDataService } from '../../common/services';

export default (function () {
	'use strict';

	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.controller('AutorizarScrapController', AutorizarScrapController);

		AutorizarScrapController.$inject = ['$scope', '$log', '$uibModalInstance',
			'MovimientoStockDataService', 'UbicacionScrapDataService',
			'StockEnfermeriaLogicService',
			'AlertaService'];

		function AutorizarScrapController($scope, $log, $uibModalInstance,
			MovimientoStockDataService: IMovimientoStockDataService, UbicacionScrapDataService: IUbicacionScrapDataService,
			StockEnfermeriaLogicService,
			AlertaService: IAlertaService) {

			$log.debug('AutorizarScrapController: ON.-');

			/* ------------------------------ API Y VARIABLES ------------------------------ */

			$scope.formData = {
				enfermera: '',
				searchEnfermera: '',
				subseccion: ''
			};

			$scope.data = {
				movimientosDetalle: [],
				ubicacionScrap: '',
				movimiento: '',
				movimientosDetalleFiltrado: []
			};

			$scope.formControl = {
				error: true,
				loading: false,
				tieneAsignacionTemporal: false,
				habilitarAceptar: false,


				reloadPage: activate,
				ok: autorizar,
				cancel: cancel
			};

			/* ------------------------------ IMPLEMENTACIÓN ------------------------------ */


			function inicializarVariables() {
				$scope.data.movimiento = StockEnfermeriaLogicService.movimiento;
				$scope.formControl.loadingModal = true;
				UbicacionScrapDataService
					.getUbicacionScrapEnfermeraByUbicacion($scope.data.movimiento.UbicacionHasta.id_ubicacion)
					.then(function (pUbicacionScrap) {
						$scope.data.ubicacionScrap = pUbicacionScrap;
						GetMovimientoDetallePorMovimiento($scope.data.movimiento);
						$log.debug('AutorizarScrapController: autorizarScrap ON.-');
					}, function () {
						$scope.formControl.loadingModal = false;
					});
			}

			function autorizar() {
				MovimientoStockDataService.autorizarMovimiento($scope.data.movimiento.id_movimiento)
					.then(function () {
						$log.debug('AutorizarScrapController: autorizarScrap OK.-');
						AlertaService.NewSuccess('Movimiento autorizado', "");
						$uibModalInstance.close();
					}, function () {
						$scope.formControl.loadingModal = false;
					});
			}

			function GetMovimientoDetallePorMovimiento(pMovimiento) {
				$log.debug('AutorizarScrapController: GetMovimientoDetallePorMovimiento ON.-');
				$scope.data.movimiento = pMovimiento;
				MovimientoStockDataService.getMovimientoDetalleComprimidoPorMovimiento(pMovimiento.id_movimiento)
					.then(function (pDetallesMovimiento) {
						$scope.data.movimientosDetalle = pDetallesMovimiento;
						$log.debug('AutorizarScrapController: GetMovimientoDetallePorMovimiento OK.-');
						getDescartablesPorMovimiento();
					});
			}

			function getDescartablesPorMovimiento() {
				$log.debug('AutorizarScrapController: getDescartablesPorMovimiento ON.-');
				MovimientoStockDataService.getMaterialesPorMovimiento($scope.data.movimiento.id_movimiento)
					.then(function (pDescartables) {
						$scope.data.descartables = pDescartables;
						$scope.formControl.error = false;
						var k = 0;
						$scope.data.movimientosDetalleFiltrado = [];
						if ($scope.data.movimientosDetalle != null && $scope.data.descartables != null) {
							for (var i = 0; i < $scope.data.movimientosDetalle.length; i++) {
								for (var j = 0; j < $scope.data.descartables.length; j++) {
									if ($scope.data.descartables[j].id_producto ==
										$scope.data.movimientosDetalle[i].id_producto &&
										$scope.data.movimientosDetalle[i].id_estado_movimiento_detalle != 61) {
										$scope.data.movimientosDetalleFiltrado[k] = $scope.data.movimientosDetalle[i];
										$scope.data.movimientosDetalleFiltrado[k].Producto = {};
										$scope.data.movimientosDetalleFiltrado[k].Producto.nombre =
											$scope.data.descartables[j].nombre;
										$scope.data.movimientosDetalleFiltrado[k].Producto.costo =
											$scope.data.descartables[j].costo;
										$scope.data.movimientosDetalleFiltrado[k].Producto.id_producto =
											$scope.data.descartables[j].id_producto;
										$scope.data.movimientosDetalleFiltrado[k].cantidad_real =
											$scope.data.movimientosDetalleFiltrado[k].cantidad_productos;
										k += 1;
									}
								}
							}
						}
						$log.debug('AutorizarScrapController: getDescartablesPorMovimiento OK.-');
						$scope.formControl.loadingModal = false;
						// slc.mostrarDetalleMovimiento();
					}, function () {
					});
			}



			function cancel() {
				$uibModalInstance.dismiss('cancel');
			}


			/* ------------------------------ ACTIVATE ------------------------------ */

			activate();

			/* Método inicializador */
			function activate() {
				$log.debug('AutorizarScrapController: Inicializar ON.-');
				inicializarVariables();

				// 	vm.formControl.loading = true;

				// 	$q.all([
				// 		GuardiaAtencionDataService.getAllMedicamentos()
				// 	])
				// 	.then(activateOk, activateError)
			}


		}
	};

	return module;
})();