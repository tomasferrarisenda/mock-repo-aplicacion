import * as angular from 'angular';
import { ICredentialsDataService } from 'core/security';

export default (function () {
	'use strict';
	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.controller('GuardiaListController', GuardiaListController);

		// Inyección de Dependencia
		GuardiaListController.$inject = [
			'$scope', '$log', '$filter', '$q', 'GuardiaAtencionDataService', 'GuardiaAtencionAuthService',
			'GuardiaAtencionLogicService', 'CuestionarioService',
			'SecurityLogicService', '$state',
			'TITLE_ATENCION', 'CredentialsDataService'
		];

		// Constructor del Controller
		function GuardiaListController(
			$scope, $log, $filter, $q, GuardiaAtencionDataService, GuardiaAtencionAuthService,
			GuardiaAtencionLogicService, CuestionarioService,
			SecurityLogicService, $state,
			TITLE_ATENCION, CredentialsDataService: ICredentialsDataService) {

			$log.debug('GuardiaListController: ON.-');


			$scope.title = {
				module: TITLE_ATENCION.MODULE,
				page: TITLE_ATENCION.LIST
			};

			$scope.formData = {
				paciente: '',
				prescripcion: '',
				sucursal: ''
				// Información del formulario
			};

			$scope.data = {
				// Información traida desde la BD
				prescripciones: [],
				sucursales: [],
				user: {}// Usuario con rol del modulo

			};

			$scope.filter = {
				prescripciones: [], // Lista filtrada para paginacion
				paciente: '',
				nombre_completo: '',
				numero_documento: '',
				clean: cleanFilters,
				validar: validarFilters
			};

			$scope.formControl = {
				// Manejo del formulario
				error: true,
				loading: false,

				newPedido: newPedido,
				elegirSucursal: elegirSucursal,
				verDetalle: verDetalle,
				reloadPage: activate,
				volver: volver,
				colorearPrioridad:colorearPrioridad
			};

			$scope.paginacion = {
				currentPage: 0,
				pageSize: 0,
				totalItems: 0,
				pageChanged: getPage,
				getPage: getPage,
				filterNombre: filterNombre
			};

			/* IMPLEMENTACIÓN DE MÉTODOS*/

			/* FORMULARIO */

			function volver() {
				// Ejemplo
				// $location.url('/Home');
			}

			/* PAGINACIÓN */

			function cleanFilters() {
				$scope.filter.paciente = '';
			}

			function validarFilters() {
				if ($scope.filter.paciente == null) {
					$scope.filter.paciente = '';
				}
			}

			function getPage() {
				var begin = (($scope.paginacion.currentPage - 1) * $scope.paginacion.pageSize);
				var end = begin + $scope.paginacion.pageSize;
				$scope.filter.validar();
				$scope.filter.prescripciones = $filter('filter')
					($scope.data.prescripciones,
					{
						// Paciente:
						// {
						// 	nombre_completo : $scope.filter.paciente.nombre_completo
						// }

						// Agregar los filters restantes
					});
				$scope.paginacion.totalItems = $scope.filter.prescripciones.length;
				$scope.filter.prescripciones = $scope.filter.prescripciones.slice(begin, end);
			}

			function filterNombre() {
				$scope.filter.paciente = $scope.formData.prescripcion.Paciente;
				getPage();
			}

			function newPedido() {
				// CuestionarioService.NewCuestionario(2,1,25770);
				GuardiaAtencionDataService.sucursal = $scope.data.id_sucursal;
				$state.go('guardiaAtencion.urgencia');
			}

			function verDetalle(pPrescripcion) {
				GuardiaAtencionDataService.prescripcion = pPrescripcion;
				$log.debug('pPrescripcion', pPrescripcion);
				GuardiaAtencionLogicService.viewPrescripcion()
					.then(function (argument) {
						if (argument == "Alta") {

							GuardiaAtencionLogicService.altaPrescripcion()
								.then(function () {
									activate();
								});
						}
						else {
							// activate();
						}
					}, function (argument) {
						activate();
					});
			}

			//carga de sucursal en caso de que no haya usuario logueado
			function elegirSucursal() {
				$scope.formControl.loading = true;
				if ($scope.formData.sucursal) {
					$scope.data.id_sucursal = $scope.formData.sucursal.suc;
					inicializarVariables();
					GuardiaAtencionDataService.sucursal = $scope.data.id_sucursal;
				}

				$scope.formControl.hayUsuario = true;
			}

			function colorearPrioridad(pPrioridad) {
				return GuardiaAtencionLogicService.colorearPrioridad(pPrioridad);
			}


			function inicializarVariables() {
				$scope.formControl.hayUsuario = true;
				GuardiaAtencionDataService.sucursal = $scope.data.id_sucursal;
				GuardiaAtencionDataService.getUbicacionBySucursal($scope.data.id_sucursal)
					.then(function (_ubicacion) {
						GuardiaAtencionDataService.getAllPrescripciones(_ubicacion.id_ubicacion)
							.then(function (_prescripciones) {
								$scope.data.prescripciones = _prescripciones;
								$scope.paginacion.currentPage = 1;
								$scope.paginacion.pageSize = 20;
								getPage();
								$scope.formControl.loading = false;
							});
					});
			}

			activate();
			/* Método inicializador */
			function activate() {
				$log.debug('GuardiaListController: Inicializar ON.-');
				$scope.formControl.loading = true;
				if (GuardiaAtencionDataService.sucursal)
					$scope.data.id_sucursal = GuardiaAtencionDataService.sucursal;
				// Si el usuario esta logueado

				if ($scope.data.id_sucursal > 0) {
					inicializarVariables();
				}
				else {
					CredentialsDataService.Get()
						.then(function (user) {
							$log.debug('user', user);
							$scope.data.user = user;
							if (user.sucursales && user.sucursales[0]) {
								$scope.data.id_sucursal = user.sucursales[0].Id;
								inicializarVariables();
								$scope.formControl.hayUsuario = true;
							}
							else {
								getSucursales();
							}
							CredentialsDataService.Clear();
						},
						function () {
							getSucursales();
						});
				}
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