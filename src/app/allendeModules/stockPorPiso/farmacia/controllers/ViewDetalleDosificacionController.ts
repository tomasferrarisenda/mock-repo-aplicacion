import { IMovimientoStockDataService, IDosificacionDataService } from '../../common/services';

export default (function () {
	'use strict';

	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.controller('ViewDetalleDosificacionController', ViewDetalleDosificacionController);

		ViewDetalleDosificacionController.$inject = ['$scope', '$log', '$q', '$uibModalInstance',
			'MovimientoStockDataService', 'DosificacionDataService',
			'StockFarmaciaLogicService', 'AlertaService'];

		function ViewDetalleDosificacionController($scope, $log, $q, $uibModalInstance,
			MovimientoStockDataService: IMovimientoStockDataService, DosificacionDataService: IDosificacionDataService,
			StockFarmaciaLogicService, AlertaService: IAlertaService) {

			$log.debug('ViewDetalleDosificacionController: ON.-');

			/* ------------------------------ API Y VARIABLES ------------------------------ */

			$scope.formData = {

			};

			$scope.data = {
				dosificacion: StockFarmaciaLogicService.dosificacion,
				internacion: StockFarmaciaLogicService.internacion
			};

			$scope.formControl = {
				error: true,
				loading: false,
				hayCargado: false,
				materialCargado: false,
				urgencia: false,
				guardia: false,
				cargarProducto: false,
				noDosificacionesDesca: true,
				facturacion: StockFarmaciaLogicService.facturacion,

				botonEstado: botonEstado,
				estadoChanged: estadoChanged,
				reloadPage: activate,
				ok: guardar,
				suma: suma,
				resta: resta,
				cancel: cancel,

				agregarProducto: agregarProducto,
				nuevoProducto: nuevoProducto,
				sumaProducto: sumaProducto,
				restaProducto: restaProducto,
				botonEstadoProducto: botonEstadoProducto,
				estadoChangedProducto: estadoChangedProducto,

				devolucionToma: devolucionToma,
				facturarToma: facturarToma,
				facturarDosif: facturarDosif,
				devolucionDosif: devolucionDosif
			};

			/* ------------------------------ IMPLEMENTACIÓN ------------------------------ */


			function inicializarVariables() {

				$log.debug('dosificacion', $scope.data.dosificacion);
				if($scope.data.dosificacion.total_dosis > 0 && $scope.data.dosificacion.cantidad_dosis > 0) {
					$scope.data.dosificacion.cada_horas = (24 / ($scope.data.dosificacion.total_dosis / $scope.data.dosificacion.cantidad_dosis)).toFixed(1).replace(/\.0+$/,'');
				} else {
					$scope.data.dosificacion.cada_horas = 0;
				}
				if ($scope.data.dosificacion.Estado.nombre_estado == "Suspendido") {
					$scope.data.dosificacion.Estado.deshabilitado = true;
				}
				for (var i = 0; i < $scope.data.dosificacion.Tomas.length; i++) {
					$scope.data.dosificacion.Tomas[i].newFacturacion = false;
					$scope.data.dosificacion.Tomas[i].newDevolucion = false;
					if ($scope.data.dosificacion.Tomas[i].Estado.nombre_estado == "Facturado") {
						$scope.data.dosificacion.Tomas[i].deshabilitado = true;
						$scope.data.dosificacion.Tomas[i].facturado = true;
					}
					if ($scope.data.dosificacion.Tomas[i].Estado.nombre_estado == "Suministrado") {
						if($scope.data.dosificacion.Tomas[i].cantidad_entregada == 0) {
							$scope.data.dosificacion.Tomas[i].deshabilitado = false;
						} else {
							$scope.data.dosificacion.Tomas[i].deshabilitado = true;
						}
						$scope.data.dosificacion.Tomas[i].facturado = false;
					}
					// if ($scope.data.dosificacion.Tomas[i].Estado.nombre_estado == "Pendiente") {
					// 	if($scope.data.dosificacion.Tomas[i].cantidad_entregada > 0) {
					// 		$scope.data.dosificacion.Tomas[i].deshabilitado = true;
					// 	}	
					// }
					if ($scope.data.dosificacion.Tomas[i].Estado.nombre_estado == "Devuelto") {
						$scope.data.dosificacion.Tomas[i].deshabilitado = true;
						$scope.data.dosificacion.Tomas[i].devuelto = true;
					}
					$scope.data.dosificacion.Tomas[i].cantidad = $scope.data.dosificacion.Tomas[i].cantidad_cargada;
					if ($scope.data.dosificacion.Tomas[i].cantidad == 0) {
						$scope.data.dosificacion.Tomas[i].minimo = true;
					}
					$scope.data.dosificacion.Tomas[i].cantidad_o = $scope.data.dosificacion.Tomas[i].cantidad;
					if ($scope.data.dosificacion.Tomas[i].cantidad_entregada == 0) {
						$scope.data.dosificacion.Tomas[i].noEntregados = true;
					}

					if($scope.data.dosificacion.Tomas[i].cantidad_entregada > 0) {
						$scope.data.dosificacion.Tomas[i].deshabilitado = true;
					}
				}
				if ($scope.data.dosificacion.observacion_medica != null &&
					$scope.data.dosificacion.observacion_medica !=
					"                                                                                                                        ") {
					$scope.data.dosificacion.hayObservacionMedica = true;
				}
			}

			function suma(index) {

				$scope.data.dosificacion.Tomas[index].cantidad += 1;
				$scope.data.dosificacion.Tomas[index].minimo = false;

				hayCargados();
			}

			function resta(index) {

				$scope.data.dosificacion.Tomas[index].cantidad -= 1;
				if ($scope.data.dosificacion.Tomas[index].cantidad == 0) {
					$scope.data.dosificacion.Tomas[index].minimo = true;
				}
				hayCargados();
			}

			function hayCargados() {
				$scope.formControl.hayCargado = false;
				for (var i = 0; i < $scope.data.dosificacion.Tomas.length; i++) {
					if ($scope.data.dosificacion.Tomas[i].cantidad > 0) {
						$scope.formControl.hayCargado = true;
					}
				}
			}

			function guardar() {
				if ($scope.formControl.facturacion) {
					guardarFacturacion();
				}
				else {
					guardarDosificacion();
				}
			}

			function guardarDosificacion() {
				var _dosificacion: any = {};
				_dosificacion.id_dosificacion = $scope.data.dosificacion.id_dosificacion;
				_dosificacion.id_sucursal = $scope.data.dosificacion.id_sucursal;
				_dosificacion.observacion_farmacia = $scope.data.dosificacion.observacion_farmacia;
				_dosificacion.Tomas = [];
				for (var i = 0; i < $scope.data.dosificacion.Tomas.length; i++) {
					if ($scope.data.dosificacion.Tomas[i].cantidad != $scope.data.dosificacion.Tomas[i].cantidad_cargada) {
						$scope.data.dosificacion.Tomas[i].cantidad_entregada = $scope.data.dosificacion.Tomas[i].cantidad;
						_dosificacion.Tomas.push($scope.data.dosificacion.Tomas[i]);
					}
				}
				var _object = {};
				_object['dosificacion'] = _dosificacion;
				_object['estado'] = $scope.data.dosificacion.Estado.id_estado;
				_object['usuario'] = $scope.data.usuario.id;

				var _newDosificaciones: Array<any> = [];
				for (var i = 0; i < $scope.data.dosificacion.DosificacionesDesca.length; i++) {
					var _dosif = {
						id_sucursal: $scope.data.dosificacion.id_sucursal,
						numero_internado: $scope.data.dosificacion.numero_internado,
						numero_articulo: $scope.data.dosificacion.DosificacionesDesca[i].Material.numero_articulo,
						id_estado: $scope.data.dosificacion.DosificacionesDesca[i].Estado.id_estado,
						matricula: $scope.data.dosificacion.id_dosificacion,
						cantidad_cargada: $scope.data.dosificacion.DosificacionesDesca[i].cantidad_cargada,
						id_dosificacion: $scope.data.dosificacion.DosificacionesDesca[i].id_dosificacion
					};
					_newDosificaciones.push(_dosif);
				}

				$log.debug('_newDosificaciones', _newDosificaciones);
				$scope.formControl.loading = true;
				DosificacionDataService.guardarDosificacion(_object)
					.then(function () {
						$log.debug('GuardarDosificacion OK');
						var _llamadas: Array<any> = [];
						for (var i = _newDosificaciones.length - 1; i >= 0; i--) {
							_llamadas.push(MovimientoStockDataService.newDosificacion(_newDosificaciones[i]));
						}
						$q.all(_llamadas)
							.then(function () {
								$log.debug('NewDosificaciones OK');
								$scope.formControl.loading = false;
								$uibModalInstance.close();
							});
					}, function () {
						$scope.formControl.loading = false;
					});
			}

			function guardarFacturacion() {
				var _llamadas: Array<any> = [];
				var _hayCambios = false;
				for (var i = 0; i < $scope.data.dosificacion.Tomas.length; i++) {
					if ($scope.data.dosificacion.Tomas[i].newFacturacion) {
						_llamadas.push(DosificacionDataService
							.facturarToma($scope.data.dosificacion.Tomas[i].id_toma, $scope.data.dosificacion.id_sucursal));
						_hayCambios = true;
					}
					if ($scope.data.dosificacion.Tomas[i].newDevolucion) {
						_llamadas.push(DosificacionDataService
							.devolucionToma($scope.data.dosificacion.Tomas[i].id_toma, $scope.data.dosificacion.id_sucursal));
						_hayCambios = true;
					}
				}
				for (var i = 0; i < $scope.data.dosificacion.DosificacionesDesca.length; i++) {
					if ($scope.data.dosificacion.DosificacionesDesca[i].newFacturacion) {
						_llamadas.push(DosificacionDataService
							.facturarDosificacion($scope.data.dosificacion.DosificacionesDesca[i].id_dosificacion,
							$scope.data.dosificacion.id_sucursal));
						_hayCambios = true;
					}
					if ($scope.data.dosificacion.DosificacionesDesca[i].newDevolucion) {
						_llamadas.push(DosificacionDataService
							.devolucionDosificacion($scope.data.dosificacion.DosificacionesDesca[i].id_dosificacion,
							$scope.data.dosificacion.id_sucursal));
						_hayCambios = true;
					}
				}

				$scope.formControl.loading = true;
				$q.all(_llamadas)
					.then(function () {
						$scope.formControl.loading = false;
						if (_hayCambios) {
							$log.debug('Facturaciones - Devoluciones OK');
							AlertaService.NewSuccess("Cambios realizados correctamente");
							$uibModalInstance.close(true);
						}
						else {
							$uibModalInstance.close(true);
						}
					}, function () {
						$scope.formControl.loading = false;
					});
			}



			function cancel() {
				if ($scope.data.dosificacion.oldEstado) {
					$scope.data.dosificacion.Estado = $scope.data.dosificacion.oldEstado;
				}
				$scope.data.dosificacion.cambiarEstado = false;
				for (var i = 0; i < $scope.data.dosificacion.Tomas.length; i++) {
					$scope.data.dosificacion.Tomas[i].cantidad = $scope.data.dosificacion.Tomas[i].cantidad_o;
					$scope.data.dosificacion.Tomas[i].newFacturacion = false;
					$scope.data.dosificacion.Tomas[i].newDevolucion = false;
				}
				$uibModalInstance.dismiss('cancel');
			}

			function facturarToma(pToma) {
				for (var i = 0; i < $scope.data.dosificacion.Tomas.length; i++) {
					if ($scope.data.dosificacion.Tomas[i].id_toma == pToma.id_toma) {
						$scope.data.dosificacion.Tomas[i].newFacturacion = !$scope.data.dosificacion.Tomas[i].newFacturacion;
					}
				}
			}

			function devolucionToma(pToma) {
				for (var i = 0; i < $scope.data.dosificacion.Tomas.length; i++) {
					if ($scope.data.dosificacion.Tomas[i].id_toma == pToma.id_toma) {
						$scope.data.dosificacion.Tomas[i].newDevolucion = !$scope.data.dosificacion.Tomas[i].newDevolucion;
					}
				}
			}

			function facturarDosif(pDosif) {
				for (var i = 0; i < $scope.data.dosificacion.DosificacionesDesca.length; i++) {
					if ($scope.data.dosificacion.DosificacionesDesca[i].id_dosificacion == pDosif.id_dosificacion) {
						$scope.data.dosificacion.DosificacionesDesca[i]
							.newFacturacion = !$scope.data.dosificacion.DosificacionesDesca[i].newFacturacion;
					}
				}
			}

			function devolucionDosif(pDosif) {
				for (var i = 0; i < $scope.data.dosificacion.DosificacionesDesca.length; i++) {
					if ($scope.data.dosificacion.DosificacionesDesca[i].id_dosificacion == pDosif.id_dosificacion) {
						$scope.data.dosificacion.DosificacionesDesca[i]
							.newDevolucion = !$scope.data.dosificacion.DosificacionesDesca[i].newDevolucion;
					}
				}
			}

			function botonEstado() {
				if (!$scope.data.dosificacion.Estado.deshabilitado && $scope.data.dosificacion.esHoy && !$scope.formControl.facturacion) {
					if (!$scope.data.dosificacion.oldEstado) {
						$scope.data.dosificacion.oldEstado = $scope.data.dosificacion.Estado;
					}
					$scope.data.dosificacion.cambiarEstado = true;

				}

			}

			function estadoChanged() {
				$scope.data.dosificacion.cambiarEstado = false;
				for (var i = 0; i < $scope.data.dosificacion.DosificacionesDesca.length; i++) {
					$scope.data.dosificacion.DosificacionesDesca[i].Estado = $scope.data.dosificacion.Estado;
				}
			}

			function agregarProducto() {
				$scope.formControl.cargarProducto = !$scope.formControl.cargarProducto;
			}

			function nuevoProducto() {
				$log.debug('Producto', $scope.formData.productoNuevo);
				var _dosif: any = {};
				_dosif.Material = $scope.formData.productoNuevo;
				if($scope.data.dosificacion.id_estado != 95 && $scope.data.dosificacion.id_estado != 116) {
					_dosif.Estado = $scope.data.dosificacion.Estado;				
				} else {
					_dosif.id_estado = 102;
					for (var i = 0; i < $scope.data.estados.length; i++) {
						if($scope.data.estados[i].id_estado == 102) {
							_dosif.Estado = $scope.data.estados[i];
						}
					}
				}	
				_dosif.cantidad_cargada = 0;
				_dosif.minimo = true;
				_dosif.nuevo = true;
				_dosif.id_dosificacion = 0;

				$scope.data.dosificacion.DosificacionesDesca.push(_dosif);
				$scope.formData.productoNuevo = '';
				$scope.formControl.cargarProducto = false;
				$scope.formControl.noDosificacionesDesca = false;
			}

			function sumaProducto(index) {

				$scope.data.dosificacion.DosificacionesDesca[index].cantidad_cargada += 1;
				$scope.data.dosificacion.DosificacionesDesca[index].minimo = false;
			}

			function restaProducto(index) {

				$scope.data.dosificacion.DosificacionesDesca[index].cantidad_cargada -= 1;
				if ($scope.data.dosificacion.DosificacionesDesca[index].cantidad_cargada == 0) {
					$scope.data.dosificacion.DosificacionesDesca[index].minimo = true;
				}
			}

			function botonEstadoProducto(pDosificacion) {
				for (var i = 0; i < $scope.data.dosificacion.DosificacionesDesca.length; i++) {
					if ($scope.data.dosificacion.DosificacionesDesca[i].Material.numero_articulo == pDosificacion.Material.numero_articulo &&
						// !$scope.data.dosificacion.Estado.deshabilitado &&
						$scope.data.dosificacion.esHoy &&
						!$scope.formControl.facturacion) {
						if (!$scope.data.dosificacion.DosificacionesDesca[i].oldEstado) {
							$scope.data.dosificacion.DosificacionesDesca[i].oldEstado = $scope.data.dosificacion.DosificacionesDesca[i].Estado;
						}
						$scope.data.dosificacion.DosificacionesDesca[i].cambiarEstado = true;
					}
				}
			}

			function estadoChangedProducto(pDosificacion) {
				for (var i = 0; i < $scope.data.dosificacion.DosificacionesDesca.length; i++) {
					if ($scope.data.dosificacion.DosificacionesDesca[i].Material.numero_articulo == pDosificacion.Material.numero_articulo) {
						$scope.data.dosificacion.DosificacionesDesca[i].cambiarEstado = false;
					}
				}
			}

			/* ------------------------------ ACTIVATE ------------------------------ */

			activate();

			/* Método inicializador */
			function activate() {
				$log.debug('ViewDetalleDosificacionController: Inicializar ON');
				$scope.formControl.guardia = StockFarmaciaLogicService.guardia;
				$scope.data.usuario = StockFarmaciaLogicService.usuario;
				$scope.data.estados = StockFarmaciaLogicService.estadosDosificacion;
				$scope.data.materiales = StockFarmaciaLogicService.materiales;

				if ($scope.data.dosificacion.id_dosificacion_farmacia_ventanilla != 0) {
					$scope.formControl.urgencia = true;
				}
				if (StockFarmaciaLogicService.sucursal.Id == 1) {
					$scope.formControl.nuevaCordoba = true;
				}
				else if (StockFarmaciaLogicService.sucursal.Id == 2) {
					$scope.formControl.cerro = true;
				}
				for (var i = 0; i < $scope.data.materiales.length; i++) {
					$scope.data.materiales[i].stock = ($scope.formControl.nuevaCordoba) ? $scope.data.materiales[i].stock_nueva_cordoba : $scope.data.materiales[i].stock_cerro;
					
				}
				$scope.formControl.loading = true;
				DosificacionDataService
					.getDosificacionesDescartableByDosificacion($scope.data.dosificacion.id_dosificacion, $scope.data.dosificacion.id_sucursal)
					.then(function (_dosificacionesDesca) {
						$scope.data.dosificacion.DosificacionesDesca = _dosificacionesDesca;
						for (var i = 0; i < $scope.data.dosificacion.DosificacionesDesca.length; i++) {
							for (var j = 0; j < $scope.data.materiales.length; j++) {
								if ($scope.data.materiales[j].numero_articulo == $scope.data.dosificacion.DosificacionesDesca[i].numero_articulo) {
									$scope.data.dosificacion.DosificacionesDesca[i].Material = $scope.data.materiales[j];
								}
							}
							if ($scope.data.dosificacion.DosificacionesDesca[i].Estado.nombre_estado == "Entregado" ||
								$scope.data.dosificacion.DosificacionesDesca[i].Estado.nombre_estado == "Suspendido") {
								$scope.data.dosificacion.DosificacionesDesca[i].deshabilitado = true;
							}
							if ($scope.data.dosificacion.DosificacionesDesca[i].Estado.nombre_estado == "Facturado") {
								$scope.data.dosificacion.DosificacionesDesca[i].deshabilitado = true;
								$scope.data.dosificacion.DosificacionesDesca[i].facturado = true;
							}
							if ($scope.data.dosificacion.DosificacionesDesca[i].Estado.nombre_estado == "Devuelto") {
								$scope.data.dosificacion.DosificacionesDesca[i].deshabilitado = true;
								$scope.data.dosificacion.DosificacionesDesca[i].devuelto = true;
							}
							if($scope.data.dosificacion.DosificacionesDesca[i].cantidad_entregada > 0) {
								$scope.data.dosificacion.DosificacionesDesca[i].deshabilitado = true;
							}
						}
						if ($scope.data.dosificacion.DosificacionesDesca.length > 0) {
							$scope.formControl.noDosificacionesDesca = false;
						}
						$scope.formControl.loading = false;
					}, function () {
						$scope.formControl.loading = false;
					});

				inicializarVariables();
				// User.Id = StockFarmaciaLogicService.usuario.Id;

			}
		}
	};

	return module;
})();