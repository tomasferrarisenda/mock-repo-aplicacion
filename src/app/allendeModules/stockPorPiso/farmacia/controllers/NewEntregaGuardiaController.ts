import * as angular from 'angular';
import { IPedidoFarmaciaDataService } from '../../common/services';
export default (function () {
	'use strict';

	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.controller('NewEntregaGuardiaController', NewEntregaGuardiaController);

		NewEntregaGuardiaController.$inject = ['$scope', '$log', '$uibModalInstance',
			'AlertaService', 'PedidoFarmaciaDataService',
			'StockFarmaciaLogicService', 'SecurityLogicService'];

		function NewEntregaGuardiaController($scope, $log, $uibModalInstance,
			AlertaService: IAlertaService, PedidoFarmaciaDataService: IPedidoFarmaciaDataService,
			StockFarmaciaLogicService, SecurityLogicService) {

			$log.debug('NewEntregaGuardiaController: ON.-');

			/* ------------------------------ API Y VARIABLES ------------------------------ */

			$scope.formData = {
			};

			$scope.data = {
				pacientes: [],
				pacientesCargados: [],
				ubicacion: '',
				usuarioRetira: '',
				tipoMovimiento: 10
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
				cancel: cancel
			};

			/* ------------------------------ IMPLEMENTACIÓN ------------------------------ */


			function inicializarVariables() {

				var tieneCargados = false;
				var existe = false;
				var paciente: any = '';
				var productos: Array<any> = [];
				var pacientes: Array<any> = [];

				// for (var i = 0; i < scope.formData.paciente.Pedidos.length; i++) {
				// 	for (var j = 0; j < scope.formData.paciente.Pedidos[i].Detalles.length; j++) {
				// 		if(scope.formData.paciente.Pedidos[i].Detalles[j].Cantidad > 0)
				// 		{
				// 			tieneCargados = true;
				// 			productos.push(scope.formData.paciente.Pedidos[i].Detalles[j]);
				// 		}
				// 	}
				// }
				// if(tieneCargados)
				// {
				// 	paciente.Productos = productos;
				// }

				// for (var k = 0; k < scope.data.pacientesCargados.length; k++) {
				// 	if(scope.data.pacientesCargados[k].Nombre == scope.formData.paciente.Nombre)
				// 	{
				// 		existe = true;
				// 		if(tieneCargados)
				// 			scope.data.pacientesCargados[k] = paciente;
				// 		else
				// 			scope.data.pacientesCargados.splice(k, 1);
				// 	}
				// }
				// if(!existe)
				// 	scope.data.pacientesCargados.push(paciente);



				for (var i = 0; i < $scope.data.pacientes.length; i++) {
					paciente = angular.copy($scope.data.pacientes[i]);
					paciente.Productos = [];
					tieneCargados = false;
					productos = [];
					if ($scope.data.pacientes[i].Pedidos)
						for (var j = 0; j < $scope.data.pacientes[i].Pedidos.length; j++) {
							for (var k = 0; k < $scope.data.pacientes[i].Pedidos[j].Detalles.length; k++) {
								if ($scope.data.pacientes[i].Pedidos[j].Detalles[k].Cantidad > 0) {
									$scope.data.pacientes[i].Pedidos[j].tieneCargados = true;
									tieneCargados = true;
									paciente.Productos.push($scope.data.pacientes[i].Pedidos[j].Detalles[k]);
								}
							}
						}
					if (tieneCargados)
						pacientes.push(paciente);
				}
				$scope.data.pacientesCargados = pacientes;
			}


			function entregar() {
				$scope.formControl.loading = true;
				var pedidos: Array<any> = [];
				var pedido: any = {};
				var detalle: any = {};
				var detalles: Array<any> = [];
				$log.debug('pacientes', $scope.data.pacientes);
				for (var i = 0; i < $scope.data.pacientes.length; i++) {
					for (var j = 0; j < $scope.data.pacientes[i].Pedidos.length; j++) {
						pedido = {};
						detalles = [];
						for (var k = 0; k < $scope.data.pacientes[i].Pedidos[j].Detalles.length; k++) {
							if ($scope.data.pacientes[i].Pedidos[j].Detalles[k].Cantidad > 0) {
								detalle = {
									Id: $scope.data.pacientes[i].Pedidos[j].Detalles[k].Id,
									IdMaterial: $scope.data.pacientes[i].Pedidos[j].Detalles[k].Material.Id,
									IdTipoMaterial: $scope.data.pacientes[i].Pedidos[j].Detalles[k].Material.IdTipoMaterial,
									IdPrescripcionDetalle: $scope.data.pacientes[i].Pedidos[j].Detalles[k].IdPrescripcionDetalle,
									Cantidad: $scope.data.pacientes[i].Pedidos[j].Detalles[k].Cantidad
								};
								detalles.push(detalle);
							}
						}
						if (detalles.length > 0) {
							pedido = {
								Id: $scope.data.pacientes[i].Pedidos[j].Id,
								IdUbicacion: $scope.data.ubicacion.id_ubicacion,
								IdProfesional: $scope.data.pacientes[i].Pedidos[j].IdProfesional,
								IdUsuarioRetira: $scope.data.usuarioRetira.Id,
								Detalles: detalles
							};
						}
						if (pedido != '')
							pedidos.push(pedido);
					}
				}
				var aBack = {
					Pedidos: pedidos
				};
				$log.debug('pedidos', aBack);
				PedidoFarmaciaDataService.entregaGuardia(aBack)
					.then(function () {
						$scope.formControl.loading = false;
						$log.debug('entregar OK');
						$uibModalInstance.close(true);
						AlertaService.NewSuccess("Entrega Realizada");
					});
			}

			function verProductos(index) {

				var estado = $scope.data.pacientesCargados[index].verProductos;
				for (var i = 0; i < $scope.data.pacientesCargados.length; i++) {
					$scope.data.pacientesCargados[i].verProductos = false;
				}
				$scope.data.pacientesCargados[index].verProductos = !estado;

			}


			function print() {

			}

			function cancel() {
				$uibModalInstance.dismiss('false');
			}

			function registrarRetira() {
				$scope.data.usuarioRetira = '';
				SecurityLogicService.ValidarUsuario()
					.then(function (pCredentials) {
						$scope.data.usuarioRetira = pCredentials;
						$log.debug('usuarioRetira', $scope.data.usuarioRetira);
					});
			}

			/* ------------------------------ ACTIVATE ------------------------------ */

			activate();

			/* Método inicializador */
			function activate() {
				$log.debug('NewEntregaGuardiaController: Inicializar ON.-');
				$scope.data.materiales = StockFarmaciaLogicService.materiales;
				$scope.data.ubicacion = StockFarmaciaLogicService.ubicacionPiso;
				$scope.data.pacientes = StockFarmaciaLogicService.pacientesGuardia;
				inicializarVariables();

			}


		}
	};

	return module;
})();