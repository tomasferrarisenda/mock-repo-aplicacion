import { IAgregadoDataService } from '../../common/services';

export default (function () {
	'use strict';

	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.controller('ViewDetalleInfusionController', ViewDetalleInfusionController);

		ViewDetalleInfusionController.$inject = ['$scope', '$log', '$q', '$uibModalInstance',
			'AgregadoDataService',
			'StockFarmaciaLogicService', 'AlertaService'];

		function ViewDetalleInfusionController($scope, $log, $q, $uibModalInstance,
			AgregadoDataService: IAgregadoDataService,
			StockFarmaciaLogicService, AlertaService: IAlertaService) {

			$log.debug('ViewDetalleInfusionController: ON.-');

			/* ------------------------------ API Y VARIABLES ------------------------------ */

			$scope.formData = {
			};

			$scope.data = {
				infusion: StockFarmaciaLogicService.infusion,
				internacion: StockFarmaciaLogicService.internacion
			};

			$scope.formControl = {
				error: true,
				loading: false,
				hayCargado: false,
				materialCargado: false,
				urgencia: false,
				guardia: false,
				facturacion: StockFarmaciaLogicService.facturacion,

				facturarAgregado: facturarAgregado,
				devolucionAgregado: devolucionAgregado,
				botonEstado: botonEstado,
				estadoChanged: estadoChanged,
				reloadPage: activate,
				ok: guardar,
				suma: suma,
				resta: resta,
				newMaterial: newMaterial,
				cancel: cancel
			};

			/* ------------------------------ IMPLEMENTACIÓN ------------------------------ */

			function inicializarVariables() {

				$scope.data.infusion.Estado.deshabilitado = true;				
				//$log.debug('pedido', $scope.data.infusion);
				for (var i = 0; i < $scope.data.infusion.Agregados.length; i++) {
					$scope.data.infusion.Agregados[i].newFacturacion = false;
					$scope.data.infusion.Agregados[i].newDevolucion = false;
					$scope.data.infusion.Agregados[i].deshabilitado = false;
					//if ($scope.data.infusion.Agregados[i].Estado.nombre_estado == "Entregado" ||
					if ($scope.data.infusion.Agregados[i].Estado.nombre_estado == "Suspendido") {
						$scope.data.infusion.Agregados[i].deshabilitado = true;
					} else {
						$scope.data.infusion.Estado.deshabilitado = false;
					}
					
					// if ($scope.data.infusion.Agregados[i].Estado.nombre_estado == "Facturado") {
					// 	$scope.data.infusion.Agregados[i].deshabilitado = true;
					// 	$scope.data.infusion.Agregados[i].facturado = true;
					// }
					if ($scope.data.infusion.Agregados[i].Estado.nombre_estado == "Devuelto") {
						$scope.data.infusion.Agregados[i].deshabilitado = true;
						$scope.data.infusion.Agregados[i].devuelto = true;
					}
					if ($scope.data.infusion.Agregados[i].cantidad_cargada == null) {
						$scope.data.infusion.Agregados[i].cantidad_cargada = 0;
					}
					if ($scope.data.infusion.Agregados[i].cantidad_entregada == null) {
						$scope.data.infusion.Agregados[i].cantidad_entregada = 0;
					}
					if ($scope.data.infusion.Agregados[i].cantidad_cargada == 0) {
						$scope.data.infusion.Agregados[i].minimo = true;
					}
					$scope.data.infusion.Agregados[i].cantidad_cargada_o = $scope.data.infusion.Agregados[i].cantidad_cargada;
					if ($scope.data.infusion.Agregados[i].cantidad_entregada == 0) {
						$scope.data.infusion.Agregados[i].noEntregados = true;
					}
					//if($scope.data.infusion.Agregados[i].cantidad_entregada > 0) {
					//	$scope.data.infusion.Agregados[i].deshabilitado = true;
					//}
					$scope.data.infusion.Agregados[i].cambiarEstado = false;
				}
				if ($scope.data.infusion.dosis_pendientes > 0) {
					$scope.data.infusion.entregado = true;
				}
				$scope.formControl.loading = false;

			}

			function cargaMaterial() {
				if ($scope.formData.material.id_producto != undefined) {
					$scope.formControl.materialCargado = true;
				}
				else {
					$scope.formControl.materialCargado = false;
				}
			}

			function suma(index) {

				$scope.data.infusion.Agregados[index].cantidad_cargada += 1;
				$scope.data.infusion.Agregados[index].minimo = false;

				hayCargados();
			}

			function resta(index) {

				$scope.data.infusion.Agregados[index].cantidad_cargada -= 1;
				if ($scope.data.infusion.Agregados[index].cantidad_cargada == 0) {
					$scope.data.infusion.Agregados[index].minimo = true;
				}
				hayCargados();
			}

			function hayCargados() {
				$scope.formControl.hayCargado = false;
				for (var i = 0; i < $scope.data.infusion.Agregados.length; i++) {
					if ($scope.data.infusion.Agregados[i].cantidad_cargada > 0) {
						$scope.formControl.hayCargado = true;
					}
				}
			}

			function newMaterial(pMaterial) {

				var _detalle: any = {};
				_detalle.Material = $scope.formData.material;
				_detalle.id_producto = $scope.formData.material.id_producto;
				_detalle.cantidad_cargada = 0;
				_detalle.minimo = true;
				_detalle.agregado = true;
				$log.debug("detalleNuevo", _detalle, pMaterial);
				$scope.data.infusion.Agregados.push(_detalle);
				$scope.formData.material = '';
				cargaMaterial();
			}

			function guardar() {

				if ($scope.formControl.facturacion) {
					guardarFacturacion();
				}
				else {
					guardarInfusion();
				}


			}

			function guardarFacturacion() {
				var _llamadas: Array<any> = [];
				var _hayCambios = false;
				for (var i = 0; i < $scope.data.infusion.Agregados.length; i++) {
					if ($scope.data.infusion.Agregados[i].newFacturacion) {
						_llamadas.push(AgregadoDataService
							.facturarAgregado($scope.data.infusion.Agregados[i].id_agregado, $scope.data.infusion.id_sucursal));
						_hayCambios = true;
					}
					if ($scope.data.infusion.Agregados[i].newDevolucion) {
						_llamadas.push(AgregadoDataService
							.devolucionAgregado($scope.data.infusion.Agregados[i].id_agregado, $scope.data.infusion.id_sucursal));
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

			function guardarInfusion() {
				var _infusion: any = {};
				_infusion.id_infusion = $scope.data.infusion.id_infusion;
				_infusion.id_sucursal = $scope.data.infusion.id_sucursal;
				_infusion.observacion_farmacia = $scope.data.infusion.observacion_farmacia;
				_infusion.Agregados = [];
				for (var i = 0; i < $scope.data.infusion.Agregados.length; i++) {
					var _agregado = {
						id_agregado: $scope.data.infusion.Agregados[i].id_agregado,
						id_estado: $scope.data.infusion.Agregados[i].Estado.id_estado,
						cantidad_cargada: $scope.data.infusion.Agregados[i].cantidad_cargada
					};
					_infusion.Agregados.push(_agregado);
				}
				var _object = {};
				_object['infusion'] = _infusion;
				_object['usuario'] = $scope.data.usuario.id;

				AgregadoDataService.guardarInfusion(_object)
					.then(function () {
						$uibModalInstance.close();
					}, function () {
						$scope.formControl.loading = false;
					});
			}



			function cancel() {
				for (var i = 0; i < $scope.data.infusion.Agregados.length; i++) {
					if ($scope.data.infusion.Agregados[i].oldEstado) {
						$scope.data.infusion.Agregados[i].Estado = $scope.data.infusion.Agregados[i].oldEstado;
					}
					$scope.data.infusion.Agregados[i].cantidad_cargada = $scope.data.infusion.Agregados[i].cantidad_cargada_o;
					$scope.data.infusion.Agregados[i].newFacturacion = false;
					$scope.data.infusion.Agregados[i].newDevolucion = false;
				}
				$uibModalInstance.dismiss('cancel');
			}

			function botonEstado(pAgregado) {
				for (var i = 0; i < $scope.data.infusion.Agregados.length; i++) {
					if ($scope.data.infusion.Agregados[i].id_agregado == pAgregado.id_agregado &&
						!$scope.data.infusion.Agregados[i].deshabilitado &&
						$scope.data.infusion.esHoy &&
						!$scope.formControl.facturacion) {
						if (!$scope.data.infusion.Agregados[i].oldEstado) {
							$scope.data.infusion.Agregados[i].oldEstado = $scope.data.infusion.Agregados[i].Estado;
						}
						$scope.data.infusion.Agregados[i].cambiarEstado = true;
					}
				}
			}

			function estadoChanged(pAgregado) {
				for (var i = 0; i < $scope.data.infusion.Agregados.length; i++) {
					if ($scope.data.infusion.Agregados[i].id_agregado == pAgregado.id_agregado) {
						$log.debug('agregado', $scope.data.infusion.Agregados[i]);
						$scope.data.infusion.Agregados[i].cambiarEstado = false;
					}
				}
			}

			function facturarAgregado(pAgregado) {
				for (var i = 0; i < $scope.data.infusion.Agregados.length; i++) {
					if ($scope.data.infusion.Agregados[i].id_agregado == pAgregado.id_agregado) {
						$scope.data.infusion.Agregados[i].newFacturacion = !$scope.data.infusion.Agregados[i].newFacturacion;
					}
				}
			}

			function devolucionAgregado(pAgregado) {
				for (var i = 0; i < $scope.data.infusion.Agregados.length; i++) {
					if ($scope.data.infusion.Agregados[i].id_agregado == pAgregado.id_agregado) {
						$scope.data.infusion.Agregados[i].newDevolucion = !$scope.data.infusion.Agregados[i].newDevolucion;
					}
				}
			}

			/* ------------------------------ ACTIVATE ------------------------------ */

			activate();

			/* Método inicializador */
			function activate() {
				$log.debug('ViewDetalleInfusionController: Inicializar ON');
				$scope.formControl.loading = true;
				$scope.data.usuario = StockFarmaciaLogicService.usuario;
				$scope.data.estados = StockFarmaciaLogicService.estadosDosificacion;

				if (StockFarmaciaLogicService.sucursal.Id == 1) {
					$scope.formControl.nuevaCordoba = true;
				}
				else if (StockFarmaciaLogicService.sucursal.Id == 2) {
					$scope.formControl.cerro = true;
				}
				// User.Id = StockFarmaciaLogicService.usuario.Id;
				// TODO: Se quitan las siguientes dos lineas por que nunca sse llenan dichas variables.
				// $scope.data.allMateriales = StockFarmaciaStorageService.allMateriales;
				// $scope.data.materiales = StockFarmaciaStorageService.materiales;
				inicializarVariables();

			}
		}
	};

	return module;
})();