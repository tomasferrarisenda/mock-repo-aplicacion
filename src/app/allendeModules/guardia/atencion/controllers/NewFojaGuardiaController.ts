import * as angular from 'angular';
import { IProfesionalesDataService } from '../../../profesionales';

export default (function () {
	'use strict';
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) { 

		module.controller('NewFojaGuardiaController', NewFojaGuardiaController);

		// Inyección de Dependencia
		NewFojaGuardiaController.$inject = [
				'$scope', '$log', '$filter', '$q', '$state', 'GuardiaAtencionDataService', 
				'GuardiaAtencionLogicService', 'GuardiaAdministracionLogicService',
				'ProfesionalesDataService',
				'TITLE_ATENCION', 'User'
			];

		// Constructor del Controller
		function NewFojaGuardiaController (
				$scope, $log, $filter, $q, $state, GuardiaAtencionDataService, 
				GuardiaAtencionLogicService, GuardiaAdministracionLogicService,
				ProfesionalesDataService: IProfesionalesDataService,
				TITLE_ATENCION, User) {

				$log.debug('NewFojaGuardiaController: ON.-');
				
				// En $scope va lo que necesite modificar la vista.
				// En this (vm) va lo que no modifica la vista


				$scope.title = {
					module: TITLE_ATENCION.MODULE,
					page: TITLE_ATENCION.NEW_FOJA
				};

				$scope.formData = {
					// Información del formulario
				};

				$scope.data = {
					prescripcion: '',
					paciente: '',
					medicamentos: [],
					medicamentosCarga: [],
					tiposDosis: [],
					vias: [],
					user: User// Usuario con rol del modulo
				};

				$scope.filter = {
					lista: [], // Lista filtrada para paginacion
					nombreCompleto: '',
					clean: cleanFilters,
					validar: validarFilters
				};

				$scope.formControl = {
					// Manejo del formulario
					error: false,
					loading: false,
					vacia: false,
					reloadPage: activate,
					volver: volver,
					validarForm: validarForm,
					llenarForm: llenarForm,
					verMedicamentos: verMedicamentos,
					colorearPrioridad: colorearPrioridad,
					newFoja: newFoja,
					printFoja:printFoja

				};

				$scope.validar = {
					// error: validarError
				};

				$scope.paginacion = {
					currentPage: 0,
 					pageSize: 0,
 					totalItems: 0,
 					pageChanged : getPage,
 					getPage: getPage
				};

 				/* IMPLEMENTACIÓN DE MÉTODOS*/

 				/* FORMULARIO */

 				function volver () {
 					// Ejemplo
 					$state.go('guardiaAtencion.list');
 				}

 				// function validarError (pBool) {
 				// 	if(!pBool) {
				// 		return 'error';
				// 	}
 				// }

 				function validarForm () {
 					// body...
 				}

 				function llenarForm () {
 					// body...
 				}

 				/* PAGINACIÓN */

 				function cleanFilters () {
					$scope.filter.nombreCompleto= '';
 				}

 				function validarFilters () {
 					if ($scope.filter.nombreCompleto == null) {
 						$scope.filter.nombreCompleto = '';
 					}
 				}

 				function getPage () {
					var begin = (($scope.paginacion.currentPage - 1) * $scope.paginacion.pageSize);
					var end = begin + $scope.paginacion.pageSize;
					$scope.filter.validar();
					$scope.filter.lista = $filter('filter')
						($scope.data.lista,{
							Paciente:
							{
								NombreCompleto : $scope.filter.nombreCompleto
							}
							// Agregar los filters restantes
						});
					$scope.paginacion.totalItems = $scope.filter.lista.length;
					$scope.filter.lista = $scope.filter.lista.slice(begin, end);
					//$log.debug('NewFojaGuardiaController: GetPage OK.-');
 				}

 				function verMedicamentos(pIndex) {
					if(!$scope.data.prescripcion.Detalles[pIndex].verMateriales)
					{
						$scope.data.prescripcion.Detalles[pIndex].verMateriales = true;
					}
					else
					{
						$scope.data.prescripcion.Detalles[pIndex].verMateriales = false;
					}
					if($scope.data.prescripcion.Detalles[pIndex].Materiales.length == 0)
					{
						$scope.data.prescripcion.Detalles[pIndex].noMateriales = true;
					}
					$log.debug('detalle',$scope.data.prescripcion.Detalles[pIndex]);
				}
				

				function colorearPrioridad(pPrioridad) {
					return GuardiaAtencionLogicService.colorearPrioridad(pPrioridad);
				}

 				function inicializarVariables () {
 					GuardiaAtencionDataService.getAllDescartablesByUbicacion()
 						.then(function(pDescartables) {
 							GuardiaAtencionDataService.descartables = pDescartables;
 						});

					for (var j = 0; j < $scope.data.prescripcion.Detalles.length; j++) {
						// getIndicacion($scope.data.prescripcion.Detalles[j].Indicacion,j);
						for (var i = 0; i < $scope.data.prescripcion.Detalles[j].Materiales.length; i++) {
							// getMaterial($scope.data.prescripcion.Detalles[j].Materiales[i],j,i);
						}
						if($scope.data.prescripcion.Detalles[j].Foja)
						{
							$scope.data.prescripcion.Detalles[j].tieneFoja = true;
						}
					}
					$scope.formControl.loading = false;
 				}

				
 				// function realizarPrescripcion(pIndex) {
 				// 	$log.debug('realizarPrescripcion',$scope.data.prescripcion.Detalles[pIndex]);
 				// 	GuardiaAtencionDataService.detalle = $scope.data.prescripcion.Detalles[pIndex];
 				// 	GuardiaAtencionDataService.vias = $scope.data.vias;
					// GuardiaAtencionDataService.tiposDosis = $scope.data.tiposDosis
 				// 	GuardiaAtencionLogicService.editPrescripcion()
 				// 	.then(function (argument) {
 				// 		activate();
 				// 	});
 				// }

 				function newFoja(pIndex) {
 					GuardiaAtencionDataService.detalle = $scope.data.prescripcion.Detalles[pIndex];
 				// 	GuardiaAtencionDataService.vias = $scope.data.vias;
					// GuardiaAtencionDataService.tiposDosis = $scope.data.tiposDosis
					GuardiaAtencionDataService.profesionales = $scope.data.profesionales;
					// if($scope.data.prescripcion.Detalles[pIndex].Foja == null)
					// {
	 					GuardiaAtencionLogicService.NewFoja(User)
	 						.then(function () {
	 							activate();
	 						});
					// }
					// else
					// {
					// 	GuardiaAdministracionLogicService.printFoja($scope.data.prescripcion.Detalles[pIndex], $scope.data.prescripcion);
						
					// }
 				}

 				function printFoja(pIndex) {
 					GuardiaAdministracionLogicService.printFoja($scope.data.prescripcion.Detalles[pIndex], $scope.data.prescripcion);
 				}


 				activate();
				/* Método inicializador */
				function activate () {
					$log.debug('NewFojaGuardiaController: Inicializar ON.-',User);
					if(!GuardiaAtencionDataService.prescripcion)
					{
						$state.go('guardiaAtencion.list');
					}
					else
					{
						$log.debug('NewFojaGuardiaController: 2.-');
						$scope.formControl.loading = true;
						var _prescripcion = GuardiaAtencionDataService.prescripcion;
						var _vias = GuardiaAtencionDataService.getAllVias();
						var _tiposDosis = GuardiaAtencionDataService.getAllTiposDosis();
						var _detallesPrescripcion = GuardiaAtencionDataService.getDetallesPrescripcionRealizados();
						var _profesionales = ProfesionalesDataService.getProfesionales();

						$log.debug('NewFojaGuardiaController: 3.-');
						$q.all([_prescripcion, _vias, _tiposDosis, _detallesPrescripcion,_profesionales])
							.then(function(pResult) {
								$log.debug('NewFojaGuardiaController: 4.-');
								$scope.data.prescripcion = GuardiaAtencionDataService.prescripcion;
								$scope.data.paciente = pResult[0].Paciente;
								// $scope.data.medicamentos = pResult[2];
								$scope.data.vias = pResult[1];
								$scope.data.tiposDosis = pResult[2];
								$scope.data.prescripcion.Detalles = pResult[3];
								$scope.data.profesionales = pResult[4];
								GuardiaAtencionDataService.usuario = User;
								if($scope.data.prescripcion.Detalles.length == 0)
								{
									$scope.formControl.vacia = true;
								}
								
								$log.debug('prescripcion',$scope.data.prescripcion);
								inicializarVariables();
							});
					}
				}
			}
	};

	return module;
})();