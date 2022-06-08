import { IUbicacionPisoDataService, IMovimientoStockDataService } from '../../common/services';

export default (function () {
	'use strict';

	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.controller('InternadoStockPrintController', InternadoStockPrintController);

		// Inyección de Dependencia
		InternadoStockPrintController.$inject = ['$scope', '$log', '$q', '$uibModalInstance',
			'UbicacionPisoDataService', 'MovimientoStockDataService',
			'Movimiento'];
		// Constructor del Controller
		function InternadoStockPrintController($scope, $log, $q, $uibModalInstance,
			UbicacionPisoDataService: IUbicacionPisoDataService, MovimientoStockDataService: IMovimientoStockDataService,
			Movimiento) {

			$log.debug('InternadoStockPrintController: ON.-');

			var vm = this;

			$scope.constante = {
				movimiento: Movimiento
			};

			$scope.formData = {
				aval: '',
				html: ''
			};

			$scope.data = {
				aval: {},
				internaciones: [],
				descartables: [],
				ubicacionPiso: '',
				movimiento: Movimiento

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

			function obtenerTodosLosDetalles(pMovimiento) {
				var def, _llamadas;

				def = $q.defer();
				_llamadas = [];

				for (var i = $scope.data.internaciones.length - 1; i >= 0; i--) {
					_llamadas.push(vm.obtenerDetallesPorInternado(pMovimiento, i));
				}

				$q.all(_llamadas)
					.then(function () {
						def.resolve(true);
					}, function (pError) {
						def.reject(pError);
					});

				return def.promise;
			}

			vm.obtenerDetallesPorInternado = function (pMovimiento, k) {
				var def;

				def = $q.defer();

				MovimientoStockDataService.getMovimeintosDetalleByMovimientoRepuestoAndInternacion(pMovimiento.id_movimiento,
					$scope.data.internaciones[k].numero_internado)
					.then(function (_movimientosDetalle) {
						$scope.data.internaciones[k].movimientosDetalle = _movimientosDetalle;
						$log.debug("obtenerDetallesPorInternado", _movimientosDetalle, $scope.data.internaciones[k].id_internacion);
						for (var i = $scope.data.internaciones[k].movimientosDetalle.length - 1; i >= 0; i--) {
							for (var j = $scope.data.descartables.length - 1; j >= 0; j--) {
								if ($scope.data.descartables[j].id_producto == $scope.data.internaciones[k].movimientosDetalle[i].id_producto) {
									$scope.data.internaciones[k].movimientosDetalle[i].Producto = {};
									$scope.data.internaciones[k].movimientosDetalle[i]
										.Producto.codigo = $scope.data.descartables[j].numero_articulo;
									$scope.data.internaciones[k].movimientosDetalle[i].Producto.nombre = $scope.data.descartables[j].nombre;
									$scope.data.internaciones[k].movimientosDetalle[i]
										.Producto.presentacion = $scope.data.descartables[j].presentacion;
									$scope.data.internaciones[k].movimientosDetalle[i].Producto.costo = $scope.data.descartables[j].costo;
									def.resolve(true);
								}
							}
						}

					}, function (pError) {
						def.reject(pError);
					});

				return def.promise;
			};

			vm.imprimirInternado = function (pMovimiento) {
				$scope.formControl.loading = true;
				MovimientoStockDataService.getInternacionesPorMovimientoRepuesto(pMovimiento.id_movimiento)
					.then(function (_internaciones) {
						$log.debug('FarmaciaListController: GetInternacionesPorMovimientoRepuesto OK.-', _internaciones);
						$scope.data.internaciones = _internaciones;
						MovimientoStockDataService.getMaterialesPorMovimiento(pMovimiento.id_movimiento)
							.then(function (pDescartables) {
								$scope.data.descartables = pDescartables;
								obtenerTodosLosDetalles(pMovimiento)
									.then(function () {
										$scope.formControl.loading = false;
										setTimeout(function () { window.print(); }, 1000);
									}, function () { });

							}, function () { });
					}, function () { });
				UbicacionPisoDataService.getUbicacionPisoByUbicacion(pMovimiento.id_ubicacion_hasta)
					.then(function (pUbicacionPiso) {
						$scope.data.ubicacionPiso = pUbicacionPiso;
					}, function () { });
			};



			activate();
			/* Método inicializador */
			function activate() {
				vm.imprimirInternado($scope.constante.movimiento);
				$log.debug("modal", $scope.constante.ubicacion);
			}
		}

	};
	return module;

})();