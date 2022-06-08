/**
 * @author 			ppautasso
 * @description 	description
 */
import * as angular from 'angular';
export default (function () {

	const module = { init: (ngModule: any) => { } };


	module.init = function (module) {

		module.controller('PrestacionNewController', PrestacionNewController);

		// Inyección de Dependencia
		PrestacionNewController.$inject = ['$scope', 'Logger', '$filter', 'orderByFilter', '$q', '$uibModalInstance', 'PrestacionGestionDataService',
			'PrefacturableDataService', 'ModalService', 'AlertaService', 'IdPrestacionEdit'
		];

		// Constructor del Controller
		function PrestacionNewController($scope, $log, $filter, orderByFilter, $q, $uibModalInstance, PrestacionGestionDataService,
			PrefacturableDataService, ModalService, AlertaService, IdPrestacionEdit) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('PrestacionNewController');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			var vm = this;

			vm.data = {
				prestacion: {
					Activo: true,
					EnviarAlLlamador: true,
					Prefacturables: []
				},
				prefacturables: {},
				preFacturable: {},
				prefacturablesList: {},
				tipoPrefacturables: {},
				prefacturablesListParaAgregar: [],
				prestacionId: IdPrestacionEdit

			};

			vm.title = {
				name : '',
				icon : ''
			}

			vm.formControl = {
				loadingCalle: false,
				error: true,
				loading: false,
				getPrefacturables: getPrefacturables,
				ok: newPrestacion,
				cancel: cancel,
				addPrefacturableToList: addPrefacturableToList,
				eliminarPrefacturableDeLista: eliminarPrefacturableDeLista,
				showPrefacturablesDirective: false
			};

			vm.paginacion = {
				currentPage: 0,
				pageSize: 0,
				totalItems: 0,
				pageChanged: getPage,
				getPage: getPage
			};

			vm.filter = {
				Nombre: '',
				Codigo: '',
				clean: cleanFilters,
				validar: validarFilters
			};


			/* ------------------------------------------ IMPLEMENTACIÓN ------------------------------------------ */

			/* FORMULARIO */


			function addPrefacturableToList(prefacturable) {
				$log.debug('addPrefacturableToList', prefacturable);
				if (prefacturable) {
					//Para evitar que NO se carguen 2 Prestaciones iguales al editar.
					if (vm.data.prefacturablesListParaAgregar.find(prestacionEnLista => prestacionEnLista.IdPrefacturable === prefacturable.Id && prestacionEnLista.IdTipoPrefacturable === prefacturable.IdTipo)) {
						AlertaService.NewWarning("Esta prestación ya se encuentra asignada.");
						return;
					}
					else{
						prefacturable.IdTipoPrefacturable = prefacturable.IdTipo;
						prefacturable.IdPrefacturable = prefacturable.Id;
						prefacturable.Prefacturable = prefacturable.Nombre;
						prefacturable.Cantidad = 1;
						vm.data.prefacturablesListParaAgregar.push(prefacturable);
						// El método push() agrega uno o más elementos al final de un array.
						vm.data.prefacturableBuscado = '';
					}
				}
			}


			function eliminarPrefacturableDeLista(indice) {
				vm.data.prefacturablesListParaAgregar.splice(indice, 1);
			}

			function newPrestacion(isValid) {

				if (isValid) {

					$log.debug('newPrestacion ON.-', vm.data.prefacturableBuscado);

					if (vm.data.prefacturablesListParaAgregar.length != 0) {

						var _prestacion = vm.data.prestacion;
						vm.data.prestacion.Prefacturables = angular.copy(vm.data.prefacturablesListParaAgregar);
						$log.debug('validando prestacion ON.-', _prestacion);
						if (vm.data.prefacturableBuscado) {
							if (vm.data.prefacturablesListParaAgregar.find(x => x.Id == vm.data.prefacturableBuscado.Id && x.IdTipo == vm.data.prefacturableBuscado.IdTipo)) {
								vm.formControl.loading = true;
								PrestacionGestionDataService.validarNewPrestacion(_prestacion)
									.then(addOk, addError);
							} else {

								let _warnings = {
									IsOk: true,
									HasWarnings: true,
									WarningMessage: "Existe una prestacion sin agregar a la lista"
								};
								ModalService.validarWarning(_warnings)
									.then(function (pResult) {
										$log.debug('presultvalidar', pResult);
										if (pResult) {
											vm.formControl.loading = true;
											PrestacionGestionDataService.validarNewPrestacion(_prestacion)
												.then(addOk, addError);
										}
									}, function (pError) {

									});
							}
						} else {
							vm.formControl.loading = true;
							PrestacionGestionDataService.validarNewPrestacion(_prestacion)
								.then(addOk, addError);
						}


					} else {
						AlertaService.NewWarning("Atención", "Debe elegir por lo menos un prefacturable");
					}


				}
				function addOk(pResponse) {

					$log.debug("ValidacionNew", pResponse);

					if (pResponse.IsOk === true) {
						vm.formControl.loading = true;

						PrestacionGestionDataService.newPrestacion(_prestacion)
							.then(function (pResp) {
								vm.formControl.loading = false;
								AlertaService.NewSuccess("Prestación agregada");
								$uibModalInstance.close(pResp);
								//activate();
							}).catch(function (pErr) {
								vm.formControl.loading = false;
								AlertaService.NewError("Error de servidor");
								$uibModalInstance.dismiss(pErr);
								$log.error('ValidacionNew .-', pErr);
							});
					} else {
						if (pResponse.Message != null)
							AlertaService.NewWarning("Atención", pResponse.Message);
						else
							AlertaService.NewError("Error de servidor");
						vm.formControl.loading = false;
					}

					vm.formControl.loading = false;
				}

				function addError(pError) {
					// $uibModalInstance.dismiss(pError);
					$log.error(' activarPrefacturable ERROR.-', pError);
				}


			}

			function getPrefacturables(pPrefacturable) {

				$log.debug('getPrefacturables ON.-', pPrefacturable);
				if (pPrefacturable) {
					vm.formControl.loading = true;

					var _prefacturables = PrefacturableDataService.getPrefacturableById(pPrefacturable.Id)
						.then(searchOk, searchError);
				}

				function searchOk(pResults) {

					$log.debug('searchOk ON.-');

					vm.data.prefacturablesList = pResults;

					if (vm.data.prefacturablesListParaAgregar) {
						if (vm.data.prefacturablesListParaAgregar.length > 0) {
							angular.forEach(vm.data.prefacturablesListParaAgregar, function (_prefacturableAgregado) {
								if (vm.data.prefacturablesList.find(x => x.Id == _prefacturableAgregado.Id && x.IdTipo == _prefacturableAgregado.IdTipo))
									vm.data.prefacturablesList.find(x => x.Id == _prefacturableAgregado.Id && x.IdTipo == _prefacturableAgregado.IdTipo).checked = true;
							})
						}
					}

					vm.paginacion.currentPage = 1;
					vm.paginacion.pageSize = 4;
					vm.paginacion.getPage();
					vm.formControl.loading = false;
					vm.formControl.stateLoading = false;
					cleanFilters();

				}

				function searchError(pError) {

					vm.formControl.loading = false;
					cleanFilters();
					$uibModalInstance.dismiss(pError);
					$log.error('Inicializar ERROR.-', pError);
				}

			}

			function cancel() {
				$uibModalInstance.dismiss('cancel');
			}


			/* PAGINACIÓN */

			function cleanFilters() {
				$log.debug('cleanFilters -');

				vm.filter.Codigo = '';
				vm.filter.Nombre = '';
				vm.paginacion.pageChanged();
			}

			function validarFilters() {
				if (vm.filter.sucursal == null)
					vm.filter.sucursal = '';

				if (vm.filter.estadoCama == null)
					vm.filter.estadoCama = '';


				vm.order = {
					id: 1,
					value: 'Codigo',
					descripcion: 'Codigo (Asc)',
					reverse: false
				}

			}

			function getPage() {
				var begin = ((vm.paginacion.currentPage - 1) * vm.paginacion.pageSize);
				var end = begin + vm.paginacion.pageSize;
				vm.filter.validar();
				vm.data.prefacturablesList = orderByFilter(vm.data.prefacturablesList, vm.order.value, vm.order.reverse);

				vm.filter.prefacturablesList = $filter('filter')
					(vm.data.prefacturablesList, {
						Codigo: vm.filter.Codigo,
						Nombre: vm.filter.Nombre

					});

				vm.paginacion.totalItems = vm.filter.prefacturablesList.length;
				vm.filter.prefacturablesList = vm.filter.prefacturablesList.slice(begin, end);
			}

			/* ------------------------------ ACTIVATE ------------------------------ */

			activate();

			function activate() {
				$log.debug('Inicializar idServicioSelected ON.-', vm.data.idPrestacionSelected);

				vm.formControl.loading = true;
				var _prestacion;

				vm.title.name = vm.data.prestacionId == 0 ? 'Nueva Prestación' : 'Editar Prestación';
				vm.title.icon = vm.data.prestacionId == 0 ? 'NEW' : 'EDIT';

				if (vm.data.prestacionId != 0) {
					//tengo una prestacion para editar
					_prestacion = PrestacionGestionDataService.getPrestacionById(vm.data.prestacionId);
				} else {
					_prestacion = PrestacionGestionDataService.obtenerNuevoPrestacionMedicaPrefacturable();
				}
				var _tipoPrefacturables = PrefacturableDataService.getAllTipoPrefacturable();


				$q.all([_prestacion,
					_tipoPrefacturables
				]).then(activateOk, activateError);



				function activateOk(pResults) {

					vm.data.prestacion = pResults[0];
					vm.data.tipoPrefacturables = pResults[1];


					if (vm.data.prestacionId != 0) {

						angular.forEach(vm.data.prestacion.Prefacturables, function (_prep) {
							_prep.Id = angular.copy(_prep.IdPrefacturable);
							_prep.NombreTipo = angular.copy(_prep.TipoPrefacturable);
							_prep.Nombre = angular.copy(_prep.Prefacturable);
						})

						vm.data.prefacturablesListParaAgregar = angular.copy(vm.data.prestacion.Prefacturables);
					}



					$log.debug('Inicializar prestacion ON.-', pResults);
					vm.formControl.loading = false;

				}

				function activateError(pError) {

					vm.formControl.loading = false;
					$uibModalInstance.dismiss(pError);
					$log.error('Inicializar ERROR.-', pError);
				}


			}



		};
	};

	return module;

})();