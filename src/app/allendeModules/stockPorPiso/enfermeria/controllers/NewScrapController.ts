import { IMovimientoStockDataService, IUbicacionScrapDataService } from '../../common/services';

export default (function () {
	'use strict';

	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.controller('NewScrapController', NewScrapController);

		NewScrapController.$inject = ['$scope', '$log', '$uibModalInstance',
			'MovimientoStockDataService', 'UbicacionScrapDataService',
			'StockEnfermeriaLogicService'
		];

		function NewScrapController($scope, $log, $uibModalInstance,
			MovimientoStockDataService: IMovimientoStockDataService, UbicacionScrapDataService: IUbicacionScrapDataService,
			StockEnfermeriaLogicService) {

			$log.debug('NewScrapController: ON.-');

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
				usuario: ''

			};

			$scope.formControl = {
				error: true,
				loadingModal: false,
				observacionCargada: false,

				validarObservacion: validarObservacion,
				reloadPage: activate,
				ok: newScrap,
				cancel: cancel
			};

			/* ------------------------------ IMPLEMENTACIÓN ------------------------------ */


			function inicializarVariables() {
				$scope.data.movimiento = StockEnfermeriaLogicService.movimiento;
				$scope.formControl.loadingModal = true;
				$scope.formData.cantidad_real = '';
				$scope.data.movimientoDistinto = false;
				$scope.data.movimientosDetalleFiltrado = [];
				$scope.data.usuario = StockEnfermeriaLogicService.usuario;
				$scope.data.ubicacion = StockEnfermeriaLogicService.ubicacion;
				$scope.data.detallesScrap = StockEnfermeriaLogicService.detallesScrap;
				$scope.data.detallesMovimiento = StockEnfermeriaLogicService.detallesMovimiento;
				GetMovimientoDetallePorMovimiento($scope.data.movimiento);
			}

			function newScrap() {

				var movimiento: any = {};

				if ($scope.formData.observacion != '') {
					
					MovimientoStockDataService.autorizarMovimiento($scope.data.movimiento.id_movimiento)
						.then(function () {
							$log.debug('NewScrapController: autorizarMovimiento OK.-', $scope.data.movimiento);
							// ModalService.success('Movimiento actualizado autorizado');
							var ubicacionScrap: any = {};
							ubicacionScrap.observacion = $scope.formData.observacion;
							movimiento.observaciones = $scope.formData.observacion;
							UbicacionScrapDataService.newUbicacionScrapTraslado(ubicacionScrap)
								.then(function (pUbicacion) {
									movimiento.id_ubicacion_hasta = pUbicacion.id_ubicacion;
									movimiento.id_ubicacion_desde = $scope.data.ubicacion.id_ubicacion;
									movimiento.id_usuario_alta = $scope.data.usuario.Id;
									movimiento.DetallesMovimiento = $scope.data.detallesMovimiento;
									movimiento.id_estado_movimiento = 48;

									$log.debug('NewScrapController: addMovimiento ON.-', movimiento);
									MovimientoStockDataService.addMovimiento(movimiento)
										.then(function () {
											$log.debug('NewScrapController: addMovimiento OK.-');
											$uibModalInstance.close();
										}, function () {
											$scope.formControl.loading = false;
										});

								}, function () {
									$scope.formControl.loading = false;
								});
						}, function () {
							$scope.formControl.loading = false;
						});
				}
			}


			function validarObservacion() {
				if ($scope.formData.observacion != '') {
					$scope.formControl.observacionCargada = true;
				}
				else {
					$scope.formControl.observacionCargada = false;
				}
			}

			function GetMovimientoDetallePorMovimiento(pMovimiento) {

				$log.debug('NewScrapController: GetMovimientoDetallePorMovimiento ON.-');
				$scope.data.movimiento = pMovimiento;
				MovimientoStockDataService.getMovimientoDetalleComprimidoPorMovimiento(pMovimiento.id_movimiento)
					.then(function (pDetallesMovimiento) {
						$scope.data.movimientosDetalle = pDetallesMovimiento;
						$log.debug('NewScrapController: GetMovimientoDetallePorMovimiento OK.-');
						getDescartablesPorMovimiento();
					}, function () {
					});
			}

			function getDescartablesPorMovimiento() {
				$log.debug('NewScrapController: getDescartablesPorMovimiento ON.-');
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
										$scope.data.movimientosDetalle[i].id_producto) {
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
						$log.debug('NewScrapController: getDescartablesPorMovimiento OK.-');
						$scope.formControl.loadingModal = false;
						// slc.mostrarDetalleMovimiento();
					}, function () {
						$scope.formControl.loading = false;
					});
			}



			function cancel() {
				$uibModalInstance.dismiss('cancel');
			}


			/* ------------------------------ ACTIVATE ------------------------------ */

			activate();

			/* Método inicializador */
			function activate() {
				$log.debug('NewScrapController: Inicializar ON.-');
				inicializarVariables();


			}


		}
	};

	return module;
})();