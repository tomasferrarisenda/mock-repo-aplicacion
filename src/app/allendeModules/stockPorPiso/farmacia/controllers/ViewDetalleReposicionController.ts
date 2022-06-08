import { IMovimientoStockDataService, IUbicacionDetalleStockDataService, IUbicacionScrapDataService } from '../../common/services';

export default (function () {
	'use strict';

	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.controller('ViewDetalleReposicionController', ViewDetalleReposicionController);

		ViewDetalleReposicionController.$inject = ['$scope', '$log', '$uibModalInstance',
			'MovimientoStockDataService',
			'UbicacionDetalleStockDataService',
			'UbicacionScrapDataService',
			'StockFarmaciaLogicService', 'ModalService'];

		function ViewDetalleReposicionController($scope, $log, $uibModalInstance,
			MovimientoStockDataService: IMovimientoStockDataService,
			UbicacionDetalleStockDataService: IUbicacionDetalleStockDataService,
			UbicacionScrapDataService: IUbicacionScrapDataService,
			StockFarmaciaLogicService, ModalService: IModalService) {

			$log.debug('ViewDetalleReposicionController: ON.-');

			/* ------------------------------ API Y VARIABLES ------------------------------ */

			// $scope.formData = {
			// 	observacion: '',
			// 	searchEnfermera: '',
			// 	subseccion: ''
			// };

			$scope.data = {
				internacion: '',
				internaciones: [],
				ubicacion: '',
				ubicacionDetalle: '',
				ubicacionesDetalle: [],
				movimientosDetalleCargados: [],
				movimiento: ''
			};

			$scope.formControl = {
				error: true,
				loadingModal: false,

				verObservaciones: verObservaciones,
				reponer: reponer,
				descartar: descartar,
				reloadPage: activate,
				ok: close,
				cancel: cancel
			};

			/* ------------------------------ IMPLEMENTACIÓN ------------------------------ */


			function inicializarVariables() {
				$scope.data.internacion = StockFarmaciaLogicService.internacion;
				$scope.data.internaciones = StockFarmaciaLogicService.internaciones;
				$scope.data.ubicacion = StockFarmaciaLogicService.ubicacion;
				$scope.data.ubicacionDetalle = StockFarmaciaLogicService.ubicacionDetalle;
				$scope.data.ubicacionesDetalle = StockFarmaciaLogicService.ubicacionesDetalle;
				$scope.data.movimiento = StockFarmaciaLogicService.movimiento;
				$scope.data.movimientosDetalleCargados = StockFarmaciaLogicService.movimientosDetalleCargados;
			}

			function close() {
				StockFarmaciaLogicService.ubicacionesDetalle = $scope.data.ubicacionesDetalle;
				StockFarmaciaLogicService.movimiento = $scope.data.movimiento;
				StockFarmaciaLogicService.movimientosDetalleCargados = $scope.data.movimientosDetalleCargados;
				$uibModalInstance.close();
			}

			function verObservaciones(pIndex) {
				if (!$scope.data.movimientosDetalle[pIndex].verObservaciones) {
					$scope.data.movimientosDetalle[pIndex].verObservaciones = true;
				}
				else {
					$scope.data.movimientosDetalle[pIndex].verObservaciones = false;
				}
				$log.debug("verObservaciones", $scope.data.movimientosDetalle[pIndex]);
			}

			function cargarDetalleMovimiento(pUbicacionDetalle) {
				$log.debug("pUbicacionDetalle", pUbicacionDetalle);
				if (pUbicacionDetalle.MovimientosDetalle == undefined || pUbicacionDetalle.MovimientosDetalle.length == 0) {

					if ($scope.data.internacion.nombre_paciente != null) {
						cargarDetalleMovimientoInternado(pUbicacionDetalle);
					}
					else {
						cargarDetalleMovimientoCompleto(pUbicacionDetalle);
					}
				}
				else {
					$scope.data.movimientosDetalle = pUbicacionDetalle.MovimientosDetalle;
				}
			}

			function cargarDetalleMovimientoInternado(pUbicacionDetalle) {
				$log.debug('ViewDetalleReposicionController: cargarDetalleMovimientoInternado ON.-', $scope.data.internacion);
				$scope.data.ubicacionDetalle = pUbicacionDetalle;

				// Recorro todas las ubicaciones detalle
				for (var l = 0; l < $scope.data.ubicacionesDetalle.length; l++) {

					// Buscando la ubicación pasada por parámetro
					if ($scope.data.ubicacionesDetalle[l].id_ubicacion_detalle == pUbicacionDetalle.id_ubicacion_detalle) {

						// Limpio los movimientos detalle de dicha ubicación detalle
						$scope.data.ubicacionesDetalle[l].MovimientosDetalle = [];
						MovimientoStockDataService
							.getMovimientosPorProductoAndUbicacionAndInternacion(
								$scope.data.ubicacion.id_ubicacion,
								$scope.data.ubicacionDetalle.Producto.id_producto,
								$scope.data.internacion.id_ubicacion_internado)
							.then(function (pMovimientos) {
								$log.debug("Movimiento", pMovimientos);
								$scope.data.movimientos = pMovimientos;
								var k = 0;
								// Recorro todos los movimientos encontrados
								for (var j = 0; j < $scope.data.movimientos.length; j++) {

									// Recorro todas las internaciones
									for (var i = $scope.data.internaciones.length - 1; i >= 0; i--) {
										
										if ($scope.data.internaciones[i].Ubicacion[0].id_ubicacion == $scope.data.movimientos[j].id_ubicacion_hasta) {
											$scope.data.movimientos[j].UbicacionHasta.id = $scope.data.internaciones[i].numero_internado;
											$scope.data.movimientos[j].UbicacionHasta.nombre = $scope.data.internaciones[i].nombre_paciente;
											$scope.data.movimientos[j].internado = true;
											$log.debug('ViewDetalleReposicionController: cargarDetalleMovimientoInternado OK.-');
										}
									}

									// Recorro todos los detalle de movimiento actual
									for (var m = 0; m < $scope.data.movimientos[j].DetallesMovimiento.length; m++) {
										if ($scope.data.movimientos[j].DetallesMovimiento[m].id_producto == $scope.data.ubicacionDetalle.Producto.id_producto) {
											$scope.data.movimientos[j]
												.cantidad_productos = $scope.data.movimientos[j].DetallesMovimiento[m].cantidad_productos;
											$scope.data.ubicacionesDetalle[l]
												.MovimientosDetalle[k] = $scope.data.movimientos[j].DetallesMovimiento[m];

											if (pUbicacionDetalle.cargado == true) {
												$scope.data.ubicacionesDetalle[l].MovimientosDetalle[k].cargado = true;
											}

										}
										// TODO: Esto podría estar afuera del for, como en el método cargarDetalleMovimientoCompleto
										$scope.data.ubicacionesDetalle[l].MovimientosDetalle[k].MovimientoStock = $scope.data.movimientos[j];
										k++;
									}
								}
								$scope.formControl.loadingModal = false;
							});

						$scope.data.movimientosDetalle = $scope.data.ubicacionesDetalle[l].MovimientosDetalle;
						break;
					}
				}
				$log.debug('ViewDetalleReposicionController: cargarDetalleMovimientoInternado OK.-', $scope.data.movimientosDetalle);
			}

			function cargarDetalleMovimientoCompleto(pUbicacionDetalle) {
				$log.debug('ViewDetalleReposicionController: cargarDetalleMovimientoCompleto ON.-');
				$scope.data.ubicacionDetalle = pUbicacionDetalle;

				// Recorro todas las ubicaciones detalle
				for (var l = 0; l < $scope.data.ubicacionesDetalle.length; l++) {

					// Buscando la ubicación pasada por parámetro
					if ($scope.data.ubicacionesDetalle[l].id_ubicacion_detalle == pUbicacionDetalle.id_ubicacion_detalle) {

						// Limpio los movimientos detalle de dicha ubicación detalle
						$scope.data.ubicacionesDetalle[l].MovimientosDetalle = [];
						MovimientoStockDataService
							.getMovimientosPorProductoAndUbicacion(
								$scope.data.ubicacion.id_ubicacion,
								$scope.data.ubicacionDetalle.id_producto)
							.then(function (pMovimientos) {
								$log.debug("Movimiento", pMovimientos);
								$scope.data.movimientos = pMovimientos;
								var k = 0;
								// Recorro todos los movimientos encontrados
								for (var i = 0; i < $scope.data.movimientos.length; i++) {
									switch ($scope.data.movimientos[i].UbicacionHasta.tipo_ubicacion) {
										case 3: //PACIENTE
											cargarInternado(i);
											break;

										case 4: //SCRAP
											cargarScrapEnfermera(i);
											break;

										case 5: //SCRAP
											cargarScrapTraslado(i);
											break;

										case 9: //GUARDIA
											$scope.data.movimientos[i].UbicacionHasta.id = " ";
											$scope.data.movimientos[i].UbicacionHasta.nombre = "Guardia";
											$scope.data.movimientos[i].internado = true;
											break;
										case 7: //AJUSTE
											$scope.data.movimientos[i].UbicacionHasta.id = " ";
											$scope.data.movimientos[i].UbicacionHasta.nombre = "Ajuste de Stock";
											$scope.data.movimientos[i].ajuste = true;
											break;
									}
									// Recorro todos los detalle de movimiento actual
									for (var j = 0; j < $scope.data.movimientos[i].DetallesMovimiento.length; j++) {
										if ($scope.data.movimientos[i].DetallesMovimiento[j].id_producto == $scope.data.ubicacionDetalle.id_producto) {
											$scope.data.movimientos[i]
												.cantidad_productos = $scope.data.movimientos[i].DetallesMovimiento[j].cantidad_productos;
											$scope.data.ubicacionesDetalle[l]
												.MovimientosDetalle[k] = $scope.data.movimientos[i].DetallesMovimiento[j];

											if (pUbicacionDetalle.cargado == true) {
												$scope.data.ubicacionesDetalle[l].MovimientosDetalle[k].cargado = true;
											}

										}
									}
									$scope.data.ubicacionesDetalle[l].MovimientosDetalle[k].MovimientoStock = {};
									$scope.data.ubicacionesDetalle[l].MovimientosDetalle[k].MovimientoStock = $scope.data.movimientos[i];
									k++;
								}
								$scope.formControl.loadingModal = false;
							});

						$scope.data.movimientosDetalle = $scope.data.ubicacionesDetalle[l].MovimientosDetalle;
						break;
					}

				}
				$log.debug('ViewDetalleReposicionController: cargarDetalleMovimientoCompleto OK.-');
			}


			function cargarInternado(j) {
				for (var i = $scope.data.internaciones.length - 1; i >= 0; i--) {
					if ($scope.data.internaciones[i].id_ubicacion_internado == $scope.data.movimientos[j].id_ubicacion_hasta) {
						$scope.data.movimientos[j].UbicacionHasta.id = $scope.data.internaciones[i].numero_internado;
						$scope.data.movimientos[j].UbicacionHasta.nombre = $scope.data.internaciones[i].nombre_paciente;
						$scope.data.movimientos[j].internado = true;
						if ($scope.data.movimientos[j].observaciones != '' && $scope.data.movimientos[j].observaciones != null) {
							$scope.data.movimientos[j].hayObservaciones = true;
						}
						$log.debug('ViewDetalleReposicionController: cargarInternado OK.-');
					}
				}
			}

			function cargarScrapEnfermera(i) {
				var movimiento = $scope.data.movimientos[i];
				UbicacionScrapDataService.getUbicacionScrapEnfermeraByUbicacion($scope.data.movimientos[i].id_ubicacion_hasta)
					.then(function (pUbicacionScrap) {
						$log.debug('ViewDetalleReposicionController: getUbicacionScrapPorUbicacion OK.-');
						movimiento.UbicacionHasta.id = "Scrap";
						movimiento.hayObservaciones = true;
						movimiento.UbicacionHasta.nombre = pUbicacionScrap.observacion;
						if (movimiento.observaciones == '' || movimiento.observaciones == null) {
							movimiento.observaciones = pUbicacionScrap.observacion;
						}
						movimiento.UbicacionHasta.scrap = true;
						if (movimiento.id_estado_movimiento == 48) {
							movimiento.autorizado = true;
						}
						else {
							movimiento.autorizado = false;
						}
					});
				$scope.data.movimientos[i] = movimiento;
			}

			function cargarScrapTraslado(i) {
				var movimiento = $scope.data.movimientos[i];
				UbicacionScrapDataService.getUbicacionScrapTrasladoByUbicacion($scope.data.movimientos[i].id_ubicacion_hasta)
					.then(function (pUbicacionScrap) {
						$log.debug('ViewDetalleReposicionController: getUbicacionScrapPorUbicacion OK.-');
						movimiento.UbicacionHasta.id = "Scrap";
						movimiento.hayObservaciones = true;
						movimiento.UbicacionHasta.nombre = pUbicacionScrap.observacion;
						if (movimiento.observaciones == '' || movimiento.observaciones == null) {
							movimiento.observaciones = pUbicacionScrap.observacion;
						}
						movimiento.UbicacionHasta.scrap = true;
						if (movimiento.id_estado_movimiento == 48) {
							movimiento.autorizado = true;
						}
						else {
							movimiento.autorizado = false;
						}
					});
				movimiento.scrapReposicion = true;
				$scope.data.movimientos[i] = movimiento;
			}

			function reponer(pMovimientoDetalle) {
				$log.debug('ViewDetalleReposicionController: reponer ON.-');
				var k = 0;
				while ($scope.data.movimientosDetalleCargados[k] != null) {
					k++;
				}
				var m = 0;
				while ($scope.data.movimiento.DetallesMovimiento[m] != null) {
					m++;
				}

				for (var i = 0; i < $scope.data.ubicacionesDetalle.length; i++) {
					if (pMovimientoDetalle.id_ubicacion_detalle == $scope.data.ubicacionesDetalle[i].id_ubicacion_detalle &&
						!pMovimientoDetalle.descartado) {
						if ($scope.data.ubicacionesDetalle[i].cantidad_productos == undefined) {

							$scope.data.ubicacionesDetalle[i].cantidad_productos = 0;
						}
						$scope.data.ubicacionesDetalle[i].cantidad_productos = $scope.data.ubicacionesDetalle[i]
							.cantidad_productos + pMovimientoDetalle.cantidad_productos;

						$scope.data.movimiento.DetallesMovimiento[m] = pMovimientoDetalle; //Movimiento Ingreso

						var todosCargados = true;

						$log.debug("$scope.data.ubicacionesDetalle[i]", $scope.data.ubicacionesDetalle[i]);
						for (var j = 0; j < $scope.data.ubicacionesDetalle[i].MovimientosDetalle.length; j++) {
							if ($scope.data.ubicacionesDetalle[i].MovimientosDetalle[j].id_movimiento_stock_detalle ==
								pMovimientoDetalle.id_movimiento_stock_detalle) {
								if (!$scope.data.ubicacionesDetalle[i].MovimientosDetalle[j].cargado) {
									$scope.data.movimientosDetalleCargados[k] = $scope.data.ubicacionesDetalle[i].MovimientosDetalle[j];
								}
								$scope.data.ubicacionesDetalle[i].MovimientosDetalle[j].cargado = true;
							}
							if (!$scope.data.ubicacionesDetalle[i].MovimientosDetalle[j].cargado) {
								todosCargados = false;
							}
						}
						if (todosCargados) {
							$scope.data.ubicacionesDetalle[i].cargado = true;
						}
						break;
					}
				}
				$log.debug('ViewDetalleReposicionController: reponer OK.-');
				StockFarmaciaLogicService.ubicacionesDetalle = $scope.data.ubicacionesDetalle;
			}

			function descartar(pMovimientoDetalle) {
				$log.debug("descartar", pMovimientoDetalle);
				ModalService.confirm('¿Desea descartar este movimiento?', function (pResult) {
					if (pResult) {
						if (pMovimientoDetalle.id_movimiento_stock_detalle != undefined) {
							MovimientoStockDataService.descartarMovimientoDetalle(pMovimientoDetalle.id_movimiento_stock_detalle)
								.then(function () {
									for (var i = $scope.data.ubicacionesDetalle.length - 1; i >= 0; i--) {
										if ($scope.data.ubicacionesDetalle[i].id_producto == pMovimientoDetalle.id_producto) {
											for (var j = $scope.data.ubicacionesDetalle[i].MovimientosDetalle.length - 1; j >= 0; j--) {
												if ($scope.data.ubicacionesDetalle[i].MovimientosDetalle[j]
													.id_movimiento_stock_detalle == pMovimientoDetalle.id_movimiento_stock_detalle) {
													$scope.data.ubicacionesDetalle[i].MovimientosDetalle[j].descartado = true;
													$scope.data.ubicacionesDetalle[i].Producto.cantidad -=
														$scope.data.ubicacionesDetalle[i].MovimientosDetalle[j].cantidad_productos;
												}
											}

										}
									}
									//fnc.getUbicacionPorPisoYUbicacionMedica();
								});
						}
						else {
							UbicacionDetalleStockDataService
								.actualizarUbicacionesDetalle(pMovimientoDetalle.id_ubicacion_detalle, pMovimientoDetalle.cantidad_productos * -1)
								.then(function () {
									for (var i = $scope.data.ubicacionesDetalle.length - 1; i >= 0; i--) {
										if ($scope.data.ubicacionesDetalle[i].id_producto == pMovimientoDetalle.id_producto) {
											for (var j = $scope.data.ubicacionesDetalle[i].MovimientosDetalle.length - 1; j >= 0; j--) {
												if ($scope.data.ubicacionesDetalle[i].MovimientosDetalle[j]
													.id_movimiento_stock_detalle == pMovimientoDetalle.id_movimiento_stock_detalle) {
													$scope.data.ubicacionesDetalle[i].MovimientosDetalle[j].descartado = true;
													$scope.data.ubicacionesDetalle[i].Producto.cantidad -=
														$scope.data.ubicacionesDetalle[i].MovimientosDetalle[j].cantidad_productos;
												}
											}
										}
									}
									// fnc.getUbicacionPorPisoYUbicacionMedica();
								});
						}
					}
				});
			}

			function cancel() {
				$uibModalInstance.dismiss('cancel');
			}

			/* ------------------------------ ACTIVATE ------------------------------ */

			activate();

			/* Método inicializador */
			function activate() {
				$log.debug('ViewDetalleReposicionController: Inicializar ON.-');
				inicializarVariables();
				cargarDetalleMovimiento($scope.data.ubicacionDetalle);
			}
		}
	};

	return module;
})();