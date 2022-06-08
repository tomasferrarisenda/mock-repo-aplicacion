import * as angular from 'angular';
import { IUbicacionDataService, IMovimientoStockDataService, IDosificacionDataService, IAgregadoDataService } from '../../common/services';
import { IStockFarmaciaModalService } from '../services';

export default (function () {
	'use strict';

	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.controller('NewEntregaController', NewEntregaController);

		NewEntregaController.$inject = ['$scope', '$log', '$q', '$uibModalInstance',
			'AlertaService', 'ModalService',
			'UbicacionDataService', 'MovimientoStockDataService',
			'DosificacionDataService', 'AgregadoDataService',
			'StockFarmaciaModalService',
			'StockFarmaciaLogicService', 'SecurityLogicService'];

		function NewEntregaController($scope, $log, $q, $uibModalInstance, 
			AlertaService: IAlertaService, ModalService: IModalService, 
			UbicacionDataService: IUbicacionDataService, MovimientoStockDataService: IMovimientoStockDataService,
			DosificacionDataService: IDosificacionDataService, AgregadoDataService: IAgregadoDataService,
			StockFarmaciaModalService: IStockFarmaciaModalService,
			StockFarmaciaLogicService, SecurityLogicService) {

			$log.debug('NewEntregaController: ON.-');

			/* ------------------------------ API Y VARIABLES ------------------------------ */

			$scope.formData = {
			};

			$scope.data = {
				internaciones: [],
				internacionesPrint: [],
				materiales: [],
				ubicacion: '',
				usuarioRetira: '',
				ventanilla: false,
				tipoMovimiento: 4,
				estadoDosificacion: 102
			};

			$scope.formControl = {
				error: true,
				loading: false,
				vacio: false,

				registrarRetira: registrarRetira,

				print: print,
				verProductos: verProductos,
				reloadPage: activate,
				ok: entregar,
				cancel: cancel,
				setVentanilla: setVentanilla
			};

			/* ------------------------------ IMPLEMENTACIÓN ------------------------------ */

			function inicializarVariables() {
				$scope.data.internacionesPrint = [];
				$scope.formControl.loading = true;
				UbicacionDataService.getInternacionesPorUbicacionOnly($scope.data.ubicacion.id_ubicacion, true)
					.then(function (_internaciones) {
						$scope.data.internaciones = _internaciones;
						$scope.formControl.vacio = true;
						$log.debug('NewEntregaController: GetInternacionesPorMovimientoRepuesto OK.-', $scope.data.internaciones);
						obtenerTodosLosDetalles()
							.then(function () {
								for (var i = 0; i < $scope.data.internaciones.length; i++) {
									if ($scope.data.internaciones[i].tieneCargado) {
										$scope.data.internacionesPrint.push($scope.data.internaciones[i]);
									}
								}
								$scope.formControl.loading = false;
								if (!$scope.formControl.vacio) {
									$log.debug('NewEntregaController: print OK.-', $scope.data.internacionesPrint);
								}

							}, function () { });
					}, function () { });
			}

			function setVentanilla() {
				if ($scope.data.ventanilla) {
					$scope.data.estadoDosificacion = 96;
					$scope.data.tipoMovimiento = 10;
				}
				else {
					$scope.data.estadoDosificacion = 102;
					$scope.data.tipoMovimiento = 4;
				}
				inicializarVariables();
			}

			function obtenerTodosLosDetalles() {
				var def, _llamadas;

				def = $q.defer();
				_llamadas = [];

				for (var i = $scope.data.internaciones.length - 1; i >= 0; i--) {
					_llamadas.push(obtenerDetallesPorInternado(i));
				}

				$q.all(_llamadas)
					.then(function () {
						def.resolve(true);
					}, function (pError) {
						def.reject(pError);
					});

				return def.promise;
			}

			/**
			 * Obtiene todo lo pendiente por internado (indicce de array data.internaciones)
			 * @param k indice internado
			 */
			function obtenerDetallesPorInternado(k) {
				var def;
				var _producto: any = {};
				def = $q.defer();

				// Busca dosificaciones
				DosificacionDataService.getTotalDosificacionAEntregarPorInternado($scope.data.internaciones[k].NumeroInternado,
					$scope.data.estadoDosificacion)
					.then(function (_dosificaciones) {
						// Busca los agregados
						AgregadoDataService.getTotalAgregadosAEntregarPorInternacion($scope.data.internaciones[k].NumeroInternado,
							$scope.data.estadoDosificacion)
							.then(function (_agregados) {
								// Reviso que tenga contenido
								if (_dosificaciones.length > 0 || _agregados.length > 0) {
									$scope.data.internaciones[k].tieneCargado = true; // Si tiene cargado algo o no (disificacion o agregado)
									$scope.data.internaciones[k].verProductos = false; // NN
									$scope.formControl.vacio = false; // NN
									$scope.data.internaciones[k].Productos = []; // Inicializo productos
									// Recorro todos los materiales posibles para llenar datos
									for (var j = $scope.data.materiales.length - 1; j >= 0; j--) {
										// Dosificaciones y agregados tienen materiales.
										_producto = '';
										for (var i = _dosificaciones.length - 1; i >= 0; i--) {
											// Lleno datos del material correspondiente (Mapeo)
											if ($scope.data.materiales[j].numero_articulo == _dosificaciones[i].numero_articulo) {
												_producto = angular.copy($scope.data.materiales[j]);
												// _producto = $scope.data.materiales[j];
												_producto.Id = _dosificaciones[i].id_dosificacion;
												_producto.cantidad_cargada = _dosificaciones[i].cantidad_cargada;
												_producto.Via = _dosificaciones[i].Via;
												_producto.Estado = _dosificaciones[i].Estado;
												_producto.origen = "dosificacion";

												$scope.data.internaciones[k].Productos.push(_producto);
											}
										}
										_producto = '';
										// Lleno datos del material correspondiente (Mapeo)
										for (var i = 0; i < _agregados.length; i++) {
											if ($scope.data.materiales[j].numero_articulo == _agregados[i].numero_articulo) {
												_producto = angular.copy($scope.data.materiales[j]);
												// _producto = $scope.data.materiales[j];
												_producto.cantidad_cargada = _agregados[i].cantidad_cargada;
												_producto.Estado = _agregados[i].Estado;
												_producto.origen = "agregado";
												_producto.Id = _agregados[i].id_agregado;
												$scope.data.internaciones[k].Productos.push(_producto);

											}
										}
									}
								}

								def.resolve(true);
							}, function (pError) {
								def.reject(pError);
							});
					}, function (pError) {
						def.reject(pError);
					});

				return def.promise;
			}

			function entregar() {
				ModalService.confirm("¿Desea realizar la entrega al piso?" , function(pRes) 
				{
					if(pRes)
					{
						$scope.formControl.loading = true;
						var _movimiento = {
							id_tipo_movimiento: $scope.data.tipoMovimiento,
							id_usuario_alta: StockFarmaciaLogicService.usuario.id,
							id_ubicacion_desde: StockFarmaciaLogicService.farmacia.Ubicacion.id_ubicacion,
							id_ubicacion_hasta: StockFarmaciaLogicService.ubicacion.id_ubicacion,
							id_usuario_modificacion: 0
						};
						if ($scope.data.usuarioRetira !== '') {
							_movimiento.id_usuario_modificacion = $scope.data.usuarioRetira.id;
						}

						MovimientoStockDataService.entregarCargados(_movimiento)
							.then(function () {
								$scope.formControl.loading = false;
								$log.debug('entregar OK');
								$uibModalInstance.close(true);
								AlertaService.NewSuccess("Entrega Realizada");
							});
						}
					});
			}

			function verProductos(pInternacion) {
				for (var i = 0; i < $scope.data.internacionesPrint.length; i++) {
					if ($scope.data.internacionesPrint[i].NumeroInternado == pInternacion.NumeroInternado) {
						$scope.data.internacionesPrint[i].verProductos = !$scope.data.internacionesPrint[i].verProductos;
					}
					else {
						$scope.data.internacionesPrint[i].verProductos = false;
					}
				}
			}

			function print() {
				StockFarmaciaLogicService.estadoDosificacion = $scope.data.estadoDosificacion;
				StockFarmaciaModalService.printDosificacion();
				$uibModalInstance.close();
			}

			function cancel() {
				$uibModalInstance.dismiss('cancel');
			}

			function registrarRetira() {
				$scope.data.usuarioRetira = '';
				SecurityLogicService.ValidarUsuario()
					.then(function (pCredentials) {
						$scope.data.usuarioRetira = pCredentials;
					});
			}

			/* ------------------------------ ACTIVATE ------------------------------ */

			activate();

			/* Método inicializador */
			function activate() {
				$log.debug('NewEntregaController: Inicializar ON.-');
				$scope.data.materiales = StockFarmaciaLogicService.materiales;
				$scope.data.ubicacion = StockFarmaciaLogicService.ubicacionPiso;
				inicializarVariables();


			}


		}
	};

	return module;
})();