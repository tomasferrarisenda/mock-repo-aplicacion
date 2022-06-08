import { IUbicacionDataService, IMovimientoStockDataService } from '../../common/services';

export default (function () {
	'use strict';

	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.controller('NewAsignacionController', NewAsignacionController);

		NewAsignacionController.$inject = ['$scope', '$log', '$uibModalInstance',
			'AlertaService',
			'UbicacionDataService', 'MovimientoStockDataService',
			'Movimiento', 'ListaAsignados', 'Internado'];

		function NewAsignacionController($scope, $log, $uibModalInstance,
			AlertaService: IAlertaService,
			UbicacionDataService: IUbicacionDataService, MovimientoStockDataService: IMovimientoStockDataService,
			Movimiento, ListaAsignados, Internado) {

			$log.debug('NewAsignacionController: ON.-');

			/* ------------------------------ API Y VARIABLES ------------------------------ */

			$scope.formData = {
				observacion: ''
			};

			$scope.data = {
				listaAsignados: ListaAsignados,
				movimiento: Movimiento,
				internado: Internado
			};

			$scope.formControl = {
				error: false,
				loading: false,
				observacionCargada: false,
				botonAceptar: true,
				observacionObligatoria: false,

				cargaObservacion: cargaObservacion,
				reloadPage: activate,
				ok: asignar,
				cancel: cancel
			};

			/* ------------------------------ IMPLEMENTACIÓN ------------------------------ */


			function inicializarVariables() {
				var productos : Array<any> = [];
				for (var i = 0; i < $scope.data.movimiento.DetallesMovimiento.length; i++) {
					if($scope.data.movimiento.DetallesMovimiento[i].id_tipo_movimiento ==  2)
					{
						var producto = {
							id_producto: $scope.data.movimiento.DetallesMovimiento[i].id_producto,
							cantidad_productos: $scope.data.movimiento.DetallesMovimiento[i].cantidad_productos
						}
						productos.push(producto);
					}
				}
				var object = {
					Detalles: productos,
					NumeroInternado: $scope.data.internado.numero_internado,
					IdUbicacion: $scope.data.movimiento.id_ubicacion_desde,
					IdTipo: $scope.data.movimiento.id_movimiento
				}
				$log.debug("checkCantidaddes: ", object);
				UbicacionDataService.checkCantidades(object)
					.then(function (result) {
						if(result.length > 0)
						{
							$scope.formControl.observacionObligatoria = true;
							$scope.formControl.botonAceptar = false;
							AlertaService.NewWarning("Atencion", "Hay productos que exceden la cantidad diaria! Se debe ingresar una observacion");
							for (var i = 0; i < result.length; i++) {
								for (var j = 0; j < $scope.data.listaAsignados.length; j++) {
									if($scope.data.listaAsignados[j].id_producto == result[i].id_producto)
										$scope.data.listaAsignados[j].cantidad_entregada = result[i].cantidad_productos;
								}
								
							}
						}
							
					})
			}

			function cargaObservacion() {
				if($scope.formData.observacion && $scope.formData.observacion != '')
					$scope.formControl.botonAceptar = true;
				else if($scope.formControl.observacionObligatoria)
					$scope.formControl.botonAceptar = false;
			}


			function asignar() {
				$scope.formControl.botonAceptar = false;
				$scope.data.movimiento.observaciones = $scope.formData.observacion;
				MovimientoStockDataService.addMovimiento($scope.data.movimiento)
					.then(function () {
						$uibModalInstance.close();
						AlertaService.NewSuccess('Movimiento Cargado', "");
					});
			}

			function cancel() {
				$uibModalInstance.dismiss('cancel');
			}


			/* ------------------------------ ACTIVATE ------------------------------ */

			activate();

			/* Método inicializador */
			function activate() {
				$log.debug('NewAsignacionController: Inicializar ON.-');
				inicializarVariables();

				// 	vm.formControl.loading = true;

				// $q.all([
				// 	GuardiaAtencionDataService.getAllMedicamentosByUbicacion(),
				// 	GuardiaAtencionDataService.getAllDescartablesByUbicacion()
				// ])
				// .then(activateOk, activateError)
			}

			// function activateOk (pResult) {
			// 	$scope.data.medicamentos = pResult[0];
			// 	$scope.data.descartables = pResult[1];
			// 	$scope.formControl.loading = false;
			// }

			// function activateError (pError) {
			// 	$scope.formControl.loading = false;
			// 	$scope.formControl.error = true;
			// }
		}
	};

	return module;
})();