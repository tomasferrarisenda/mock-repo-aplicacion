import { IEnfermeraDataService, IStockCommonDataService } from '../../common/services';

export default (function () {
	'use strict';

	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.controller('AsignarEnfermeraController', AsignarEnfermeraController);

		AsignarEnfermeraController.$inject = ['$scope', '$log', '$uibModalInstance',
			'EnfermeraDataService', 'StockCommonDataService',
			'StockEnfermeriaLogicService', 'AlertaService'];

		function AsignarEnfermeraController($scope, $log, $uibModalInstance,
			EnfermeraDataService: IEnfermeraDataService, StockCommonDataService: IStockCommonDataService,
			StockEnfermeriaLogicService, AlertaService: IAlertaService) {

			$log.debug('AsignarEnfermeraController: ON.-');

			/* ------------------------------ API Y VARIABLES ------------------------------ */

			$scope.formData = {
				enfermera: '',
				searchEnfermera: '',
				subseccion: ''
			};

			$scope.data = {
				detalle: [],
				subsecciones: '',
				ubicacionesPisoEnfermera: '',
				asignacionTemporal: ''

			};

			$scope.formControl = {
				error: true,
				loading: false,
				tieneAsignacionTemporal: false,
				habilitarAceptar: false,

				seleccionarSubseccion: seleccionarSubseccion,
				asignarEnfermera: asignarEnfermera,
				reasignarEnfermera: reasignarEnfermera,
				cargarEnfermera: cargarEnfermera,
				reloadPage: activate,
				ok: asignarEnfermera,
				cancel: cancel
			};

			/* ------------------------------ IMPLEMENTACIÓN ------------------------------ */

			function inicializarVariables() {
				prestarEnfermera();
			}

			function asignarEnfermera() {
				var _asignacion : any = {};
				// StockCommonDataService.getUsuarioByNombre(StockEnfermeriaLogicService.usuario.Nombre)
				// 	.then(function (pUsuario) {
				_asignacion.id_usuario_enfermera = $scope.formData.enfermera.Id;
				_asignacion.id_usuario_supervisor = StockEnfermeriaLogicService.usuario.Id;
				_asignacion.id_subseccion = $scope.formData.subseccion.id_subseccion;
				EnfermeraDataService.addAsignacion(_asignacion)
					.then(function () {
						$log.debug('AsignarEnfermeraController: asignarEnfermera OK.-');
						AlertaService.NewSuccess('Enfermera asignada', "");
						$scope.formData.enfermera = '';
						$scope.data.ubicacionesPisoEnfermera = [];
						$scope.formData.subseccion = '';
						$uibModalInstance.close();
					});
				// },function (pError) {
				// 	$scope.formControl.loading = false;
				// })

			}

			function seleccionarSubseccion() {
				if ($scope.formData.enfermera.Nombre != undefined && $scope.formData.subseccion != undefined) {
					$log.debug($scope.formData.enfermera, $scope.formData.subseccion);
					$scope.formControl.habilitarAceptar = true;
				}
				else {
					$scope.formControl.habilitarAceptar = false;

				}

			}


			function reasignarEnfermera() {
				$log.debug('AsignarEnfermeraController: reasignarEnfermera ON.-');
				for (var i = 0; i < $scope.data.subsecciones.length; i++) {
					if ($scope.data.subsecciones[i].id_subseccion == $scope.data.asignacionTemporal.id_subseccion) {
						$scope.formData.subseccion = $scope.data.subsecciones[i];
					}
				}
				$log.debug('AsignarEnfermeraController: reasignarEnfermera OK.-');
				seleccionarSubseccion();
			}

			function prestarEnfermera() {
				$scope.formData.enfermera = '';
				$scope.formData.searchEnfermera = '';
				EnfermeraDataService.getAllEnfermeras()
					.then(function (pEnfermeras) {
						$scope.data.enfermeras = pEnfermeras;
						$log.debug('AsignarEnfermeraController: prestarEnfermera ON.-');
						$scope.formControl.tieneAsignacionTemporal = false;
						// setTimeout(function (){ angular.element("[name='busquedaEnfermera']").focus(); }, 3000);
						// setTimeout(function (){ $templateCache.get('busquedaEnfermera').focus(); }, 3000);
						//asignarEnfermera();
					}, function () {
						$scope.formControl.loading = false;
					});
			}

			function cargarEnfermera() {
				$scope.formControl.tieneAsignacionTemporal = false;
				$scope.formData.subseccion = '';
				$scope.data.ubicacionesPisoEnfermera = [];
				$scope.data.subsecciones = [];
				if ($scope.formData.enfermera != null && $scope.formData.enfermera.Nombre != null) {
					EnfermeraDataService.getUbicacionesByUsuarioAndSucursal($scope.formData.enfermera.Id,
						StockEnfermeriaLogicService.usuario.sucursales[0].Id)
						.then(function (pUbicaciones) {
							$log.debug('AsignarEnfermeraController: cargarEnfermera ON.-', pUbicaciones);
							$scope.data.ubicacionesPisoEnfermera = pUbicaciones;
							StockCommonDataService.getAllSubsecciones()
								.then(function (pSubsecciones) {
									$scope.data.subsecciones = pSubsecciones;
									EnfermeraDataService.getLastAsignacionByIdUsuario($scope.formData.enfermera.Id)
										.then(function (pAsignacion) {
											if (pAsignacion != null) {
												$scope.data.asignacionTemporal = pAsignacion;
												$scope.formControl.loading = false;
												var fecha = new Date();
												var fechaAsignacion = Date.parse($scope.data.asignacionTemporal.fecha_hasta);
												if (fecha.valueOf() < fechaAsignacion) {
													$scope.formControl.tieneAsignacionTemporal = true;
												}
											}
										}, function () {
											$scope.formControl.loading = false;
										});
								}, function () {
									$scope.formControl.loading = false;
								});
						}, function () {
							$scope.formControl.loading = false;
							$scope.formData.enfermera = '';
							$scope.data.ubicacionesPisoEnfermera = [];
						});
				}
			}



			function cancel() {
				$uibModalInstance.dismiss('cancel');
			}


			/* ------------------------------ ACTIVATE ------------------------------ */

			activate();

			/* Método inicializador */
			function activate() {
				$log.debug('AsignarEnfermeraController: Inicializar ON.-');
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