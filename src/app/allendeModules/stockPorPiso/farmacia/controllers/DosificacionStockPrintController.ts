import * as angular from 'angular';
import { IUbicacionDataService, IDosificacionDataService, IAgregadoDataService } from '../../common/services';
export default (function () {
	'use strict';

	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.controller('DosificacionStockPrintController', DosificacionStockPrintController);

		// Inyección de Dependencia
		DosificacionStockPrintController.$inject = ['$scope', '$log', '$q',
			'UbicacionDataService', 'DosificacionDataService',
			'AgregadoDataService', 'AlertaService',
			'StockFarmaciaLogicService'];

		// Constructor del Controller
		function DosificacionStockPrintController($scope, $log, $q,
			UbicacionDataService: IUbicacionDataService, DosificacionDataService: IDosificacionDataService,
			AgregadoDataService: IAgregadoDataService,
			AlertaService,
			StockFarmaciaLogicService) {

			$log.debug('DosificacionStockPrintController: ON.-');

			var vm = this;

			$scope.formData = {
				aval: '',
				html: ''
			};

			$scope.data = {
				aval: {},
				internaciones: [],
				descartables: [],
				ubicacionPiso: ''

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

			function obtenerTodosLosDetalles() {
				var def, _llamadas;

				def = $q.defer();
				_llamadas = [];

				for (var i = $scope.data.internaciones.length - 1; i >= 0; i--) {
					_llamadas.push(vm.obtenerDetallesPorInternado(i));
				}

				$q.all(_llamadas)
					.then(function () {
						def.resolve(true);
					}, function (pError) {
						def.reject(pError);
					});

				return def.promise;
			}

			vm.obtenerDetallesPorInternado = function (k) {
				var def;
				var _producto: any = {};
				def = $q.defer();

				DosificacionDataService.getTotalDosificacionAEntregarPorInternado($scope.data.internaciones[k].NumeroInternado,
					StockFarmaciaLogicService.estadoDosificacion)
					.then(function (_dosificaciones) {
						AgregadoDataService.getTotalAgregadosAEntregarPorInternacion($scope.data.internaciones[k].NumeroInternado,
							StockFarmaciaLogicService.estadoDosificacion)
							.then(function (_agregados) {
								if (_dosificaciones.length > 0 || _agregados.length > 0) {
									$scope.data.internaciones[k].tieneCargado = true;
									$scope.formControl.vacio = false;
									$scope.data.internaciones[k].Productos = [];
									$scope.data.internaciones[k].Dosificaciones = [];
									$scope.data.internaciones[k].Agregados = [];
									for (var j = $scope.data.materiales.length - 1; j >= 0; j--) {
										_producto = '';
										for (var i = _dosificaciones.length - 1; i >= 0; i--) {
											if ($scope.data.materiales[j].numero_articulo == _dosificaciones[i].numero_articulo) {
												_producto =  angular.copy($scope.data.materiales[j]);
												_producto.cantidad_cargada = _dosificaciones[i].cantidad_cargada;
												//_producto.via = (_dosificaciones[i].Via && _dosificaciones[i].descartable != 1) ? _dosificaciones[i].Via.descripcion : "";
												//_producto.via = (_dosificaciones[i].descartable == 1 || _dosificaciones[i].urgencia == "X") ? "" : _dosificaciones[i].Via.descripcion;
												_producto.via = (_dosificaciones[i].descartable == 1 || _dosificaciones[i].urgencia == "X" || !_dosificaciones[i].Via) ? "" : _dosificaciones[i].Via.descripcion;
												_producto.Estado = _dosificaciones[i].Estado;
												_producto.id = _dosificaciones[i].id_dosificacion;
												_producto.duplica = _dosificaciones[i].duplica;

												if(_dosificaciones[i].descartable == 1 || _dosificaciones[i].urgencia == "X"){
													_producto.cada_calculado = "";
												} else {
													if(_dosificaciones[i].total_dosis > 0 && _dosificaciones[i].cantidad_dosis > 0) {
														_producto.cada_calculado = (24 / (_dosificaciones[i].total_dosis / _dosificaciones[i].cantidad_dosis)).toFixed(1).replace(/\.0+$/,'') + " horas";
													} else {
														_producto.cada_calculado = "";
													}
												}
												if(_dosificaciones[i].descartable == 1 || _dosificaciones[i].urgencia == "X"){
													_producto.dosis_calculado = "";
												} else {
													if(_dosificaciones[i].TipoDosis != null && _dosificaciones[i].cantidad_dosis > 0) {
														_producto.dosis_calculado = _dosificaciones[i].cantidad_dosis + " " + _dosificaciones[i].TipoDosis.nombre_tipo_dosis;
													} else {
														_producto.dosis_calculado = "";
													}
												}

												// $scope.data.internaciones[k].Productos.push(_producto);
												$scope.data.internaciones[k].Dosificaciones.push(_producto);

											}
										}
										_producto = '';
										for (var i = 0; i < _agregados.length; i++) {
											if ($scope.data.materiales[j].numero_articulo == _agregados[i].numero_articulo) {
												_producto = angular.copy($scope.data.materiales[j]);
												_producto.cantidad_cargada = _agregados[i].cantidad_cargada;
												_producto.unidad = _agregados[i].unidad;
												_producto.Estado = _agregados[i].Estado;
												_producto.id = _agregados[i].id_agregado;
												// $scope.data.internaciones[k].Productos.push(_producto);
												$scope.data.internaciones[k].Agregados.push(_producto);
											}
										}
									}
								}
								if (_dosificaciones.length > 0)
									$scope.data.internaciones[k].hayDosificaciones = true;
								if (_agregados.length > 0)
									$scope.data.internaciones[k].hayAgregados = true;
								def.resolve(true);
							}, function (pError) {
								def.reject(pError);
							});
					}, function (pError) {
						def.reject(pError);
					});

				return def.promise;
			};

			vm.imprimirInternado = function () {
				$scope.data.internacionesPrint = [];
				$scope.formControl.loading = true;
				UbicacionDataService.getInternacionesPorUbicacionOnly($scope.data.ubicacion.id_ubicacion, true)
					.then(function (_internaciones) {
						$scope.data.internaciones = _internaciones;
						$scope.formControl.vacio = true;
						$log.debug('FarmaciaListController: GetInternacionesPorMovimientoRepuesto OK.-', $scope.data.internaciones);
						obtenerTodosLosDetalles()
							.then(function () {
								for (var i = 0; i < $scope.data.internaciones.length; i++) {
									if ($scope.data.internaciones[i].tieneCargado) {
										$scope.data.internacionesPrint.push($scope.data.internaciones[i]);
									}
								}
								$scope.formControl.loading = false;
								if (!$scope.formControl.vacio) {
									$log.debug('FarmaciaListController: print OK.-', $scope.data.internacionesPrint);
									setTimeout(function () { window.print(); }, 1000);
								} else {
									AlertaService.NewSuccess("No hay items para imprimir");								
								}

							}, function () {});
					}, function () {});
			};

			activate();
			/* Método inicializador */
			function activate() {
				$scope.data.materiales = StockFarmaciaLogicService.materiales;
				$scope.data.ubicacion = StockFarmaciaLogicService.ubicacionPiso;
				$scope.data.fecha_hora = new Date();
				$log.debug('ubicacion', $scope.data.ubicacion);
				vm.imprimirInternado();
			}
		}

	};
	return module;

})();