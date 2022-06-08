import * as angular from 'angular';
import { IProfesionalesDataService } from '../../../profesionales';
import { ICredentialsDataService } from 'core/security';

export default (function () {
	'use strict';
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) { 

		module.controller('PedidoUrgenciaController', PedidoUrgenciaController);

		// Inyección de Dependencia
		PedidoUrgenciaController.$inject = [
				'$scope','$rootScope', '$log', '$filter', '$q', 'GuardiaAtencionDataService', 
				'ProfesionalesDataService',
				'GuardiaAtencionAuthService', 'GuardiaAtencionLogicService', 'SecurityLogicService','$state','ACTION_ATENCION',
				'TITLE_ATENCION', 'AlertaService', 'CredentialsDataService'
			];

		// Constructor del Controller
		function PedidoUrgenciaController (
				$scope, $rootScope, $log, $filter, $q, GuardiaAtencionDataService, 
				ProfesionalesDataService: IProfesionalesDataService,
				GuardiaAtencionAuthService, GuardiaAtencionLogicService, SecurityLogicService,$state, ACTION_ATENCION,
				TITLE_ATENCION, AlertaService, CredentialsDataService: ICredentialsDataService) {

				$log.debug('PedidoUrgenciaController: ON.-');
				
				// En $scope va lo que necesite modificar la vista.
				// En this (vm) va lo que no modifica la vista


				$scope.title = {
					module: TITLE_ATENCION.MODULE,
					page: TITLE_ATENCION.PEDIDO_URGENCIA
				};

				$scope.formData = {
					sucursal: '',
					material: '',
					medico: ''
					// Información del formulario
				};

				$scope.data = {
					// Información traida desde la BD
					materiales: [],
					materialesFavoritos: [],
					materialesCargados: [],
					sucursales: [],
					medicos: [],
					user: {}// Usuario con rol del modulo

				};

				$scope.formControl = {
					// Manejo del formulario
					error: true,
					loading: false,
					haySucursal: false,
					medicoCargado: false,

					elegirSucursal: elegirSucursal,
					reloadPage: activate,
					limpiar: limpiar,
					volver: volver,
					suma: suma,
					resta: resta,
					tildarMaterial: tildarMaterial,
					tipearMaterial: tipearMaterial,
					borrarMaterial: borrarMaterial,
					newPedido: guardar,
					tipearMedico: tipearMedico
				};

 				/* IMPLEMENTACIÓN DE MÉTODOS*/

 				/* FORMULARIO */

 				function volver () {
 					// Ejemplo
 					$state.go('guardiaAtencion.list');
 				}

 				function limpiar() {
 					$scope.data.materialesCargados = [];
 					$scope.formData.material = '';
 					$scope.formData.medico = '';
 					for (var i = 0; i < $scope.data.materialesFavoritos.length; i++) {
 						$scope.data.materialesFavoritos[i].cantidad = 0;
 						$scope.data.materialesFavoritos[i].cargado = false;
 					}
 				}
 				/* PAGINACIÓN */

 				
	 			function suma(pMaterial) {
					for (var i = 0; i < $scope.data.materialesCargados.length; i++) {
						if($scope.data.materialesCargados[i].Id == pMaterial.Id)
						{
							$scope.data.materialesCargados[i].cantidad += 1;
							$scope.data.materialesCargados[i].minimo = false;
						}
					}
					hayCargados();
				}

				function resta(pMaterial) {
					for (var i = 0; i < $scope.data.materialesCargados.length; i++) {
						if($scope.data.materialesCargados[i].Id == pMaterial.Id)
						{
							$scope.data.materialesCargados[i].cantidad -= 1;
							if($scope.data.materialesCargados[i].cantidad == 0)
							{
								$scope.data.materialesCargados[i].minimo = true;
							}
						}
					}
					hayCargados();
				}

				function hayCargados() {
					$scope.formControl.hayCargado = false;
					for (var i = 0; i < $scope.data.materialesCargados.length; i++) {
						if($scope.data.materialesCargados[i].cantidad > 0)
						{
							$scope.formControl.hayCargado = true;
						}
					}
				}

				function tildarMaterial(i) {

					var existe = false;
					for (var j = 0; j < $scope.data.materialesCargados.length; j++) {
						if($scope.data.materialesCargados[j].Id == $scope.data.materialesFavoritos[i].Id)
						{
							existe = true;
						}
					}
					if(!existe)
					{
						$scope.data.materialesFavoritos[i].cantidad = 0;
						$scope.data.materialesFavoritos[i].minimo = true;
						$scope.data.materialesCargados.push($scope.data.materialesFavoritos[i]);
					}
					
					else
					{
						
					}
				}

				function borrarMaterial(i) {
					
					$scope.data.materialesCargados.splice(i,1);

				}

				function tipearMaterial() {
					var existe = false;
					$log.debug("tipearMaterial ON",$scope.formData.material);
					if($scope.formData.material.Id)
					{
						for (var i = 0; i < $scope.data.materialesCargados.length; i++) {
							if($scope.data.materialesCargados[i].Id == $scope.formData.material.Id)
							{
								existe = true;
								$scope.formData.material = '';
							}
						}
						if(!existe)
						{
							$log.debug("tipearMaterial noExiste",$scope.formData.material);
							$scope.formData.material.cantidad = 0;
							$scope.formData.material.minimo = true;
							$scope.data.materialesCargados.push($scope.formData.material);
							$scope.formData.material = '';
						}
					}
				}

				function tipearMedico() {
					if($scope.formData.medico.Matricula)
					{
						$scope.formControl.medicoCargado = true;
					}
					else
					{
						$scope.formControl.medicoCargado = false;
					}
				}

				// function newPedido() {
				// 	if($scope.data.materialesCargados.length > 0)
				// 	{
				// 		var pedido = {};
				// 		pedido.id_ubicacion_origen = $scope.data.ubicacion.id_ubicacion;
				// 		pedido.id_usuario_emite = $scope.formData.medico.Id;
				// 		pedido.Detalles = [];
				// 		for (var i = 0; i < $scope.data.materialesCargados.length; i++) {
				// 			if($scope.data.materialesCargados[i].cantidad > 0)
				// 			{
				// 				var detalle = {};
				// 				detalle.Id = $scope.data.materialesCargados[i].Id;
				// 				detalle.cantidad = $scope.data.materialesCargados[i].cantidad;
				// 				pedido.Detalles.push(detalle);
				// 			}
				// 		}
				// 		GuardiaAtencionDataService.newPedido(pedido)
				// 			.then(function () {
				// 				ModalService.success("Pedido cargado con exito");
				// 				limpiar();
				// 			});
				// 	}
					
				// }

				function guardar() {
					var pedido = {
						IdUbicacion: $scope.data.ubicacion.id_ubicacion,
						IdProfesional: $scope.formData.medico.Id,
						Detalles: <Array<any>> []
					};
					for (var i = 0; i < $scope.data.materialesCargados.length; i++) {
						var detalle = {
							IdMaterial: $scope.data.materialesCargados[i].Id,
							IdTipoMaterial: $scope.data.materialesCargados[i].IdTipoMaterial,
							Cantidad: $scope.data.materialesCargados[i].cantidad
						};
						pedido.Detalles.push(detalle);
					}
					$log.debug('guardarPedido',pedido);
					GuardiaAtencionDataService.newPedido(pedido)
						.then(function () {
							AlertaService.NewSuccess("Pedido cargado con exito");
							limpiar();
						});
				}

 				function elegirSucursal() {
 					$scope.formControl.loading = true;
 					$scope.data.id_sucursal = $scope.formData.sucursal.suc;
 					GuardiaAtencionDataService.sucursal = $scope.data.id_sucursal;
 					inicializarVariables();
 				}


 				function inicializarVariables () {
 					var _medicamentos = GuardiaAtencionDataService.getAllMedicamentos();
 					var _medicamentosFavoritos = GuardiaAtencionDataService.getMaterialesFavoritos();
 					var _ubicacion = GuardiaAtencionDataService.getUbicacionBySucursal($scope.data.id_sucursal);
 					var _medicos = ProfesionalesDataService.getProfesionales();
					$q.all([_medicamentos, _medicamentosFavoritos, _ubicacion, _medicos])
					.then(function(pResult) {
						$scope.data.materiales = pResult[0];
						$scope.data.materialesFavoritos = pResult[1];
						$scope.data.ubicacion = pResult[2];
						$scope.data.medicos = pResult[3];
						$scope.formControl.haySucursal = true;
						$scope.formControl.loading = false;
						$log.debug("_medicos",$scope.data.medicos);
					});
 				}

 				activate();
				/* Método inicializador */
				function activate () {
					$log.debug('PedidoUrgenciaController: Inicializar ON.-');
					$scope.formControl.loading = true;
					if(GuardiaAtencionDataService.sucursal)
						$scope.data.id_sucursal = GuardiaAtencionDataService.sucursal;

					//Si el usuario esta logueado
					CredentialsDataService.Get()
						.then(function(user) {
							$log.debug('user',user);
							$scope.data.user = user;
							if(user.sucursales[0])
							{
								$scope.data.id_sucursal = user.sucursales[0].Id;
								GuardiaAtencionDataService.sucursal = $scope.data.id_sucursal;
								inicializarVariables();
								$scope.formControl.hayUsuario = true;
							}
							else
							{
								getSucursales();
							}
							CredentialsDataService.Clear();
						},
						function () {
							if(GuardiaAtencionDataService.sucursal && GuardiaAtencionDataService.sucursal !== '')
							{
								$scope.data.id_sucursal = GuardiaAtencionDataService.sucursal;
								inicializarVariables();
							}
							else
							{
								getSucursales();
							}
						});					

				}

				function getSucursales() {
					GuardiaAtencionDataService.getSucursales()
						.then(function (pSucursales) {
							$scope.data.sucursales = pSucursales;
							$scope.formControl.loading = false;
						});
				}


			}
	};

	return module;
})();