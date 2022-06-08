/**
 * @author 			ppautasso
 * @description 	description
 */
export default (function () {

	const module = { init : (ngModule: any) => {} };

	module.init = function(module) {

		module.controller('PrestacionViewController', PrestacionViewController);

		// Inyección de Dependencia
		PrestacionViewController.$inject = ['Logger', '$filter', 'orderByFilter', '$q', '$uibModalInstance', 'PrestacionGestionDataService', 'IdPrestacionSelected',
			'PrefacturableDataService',
			'ModalService'
		];

		// Constructor del Controller
		function PrestacionViewController($log, $filter, orderByFilter, $q, $uibModalInstance, PrestacionGestionDataService, IdPrestacionSelected,
			PrefacturableDataService,
			ModalService) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('PrestacionViewController');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			var vm = this;

			vm.data = {
				idPrestacionSelected: IdPrestacionSelected,
				prestacion: {},
				prefacturables: {},
				preFacturable: {},
				prefacturablesList: {},
				tipoPrefacturables: {}

			};

			vm.formControl = {
				loadingCalle: false,
				error: true,
				loading: false,
				guardarPre: activarPrefacturable,
				getPrefacturables: getPrefacturables,
				delete: deletePrefacturable
					//ok: returnDomicilio,

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

			function activarPrefacturable(pPrefacturable) {

				$log.debug('activarPrefacturable ON.-');

				pPrefacturable.IdTipoPrefacturable = pPrefacturable.IdTipo;
				pPrefacturable.IdPrefacturable = pPrefacturable.Id;
				pPrefacturable.Prefacturable = pPrefacturable.Nombre;


				vm.data.prestacion.Prefacturables.push(pPrefacturable);

				var _prestacion = vm.data.prestacion;

				vm.formControl.loading = true;


				PrestacionGestionDataService.validarNewPrestacion(_prestacion)
					.then(addOk, addError);

				function addOk(pResponse) {

					$log.debug("ValidacionNew", pResponse);

					if (pResponse.IsOk === true) {
						vm.formControl.loading = true;
						PrestacionGestionDataService.newPrestacion(_prestacion)
							.then(function(pResp) {
								vm.formControl.loading = false;
								//$uibModalInstance.close("result ok");
								ModalService.success("Prefactura agregada");
								activate();
							}).catch(function(pErr) {
								vm.formControl.loading = false;
								ModalService.error("Error de servidor");
								//$uibModalInstance.dismiss(pErr);
								$log.error('ValidacionNew .-', pErr);
							});
					} else {
						if (pResponse.Message != null)
							ModalService.error(pResponse.Message);
						else
							ModalService.error("Error de servidor");

						activate();
						vm.formControl.loading = false;
					}

					vm.formControl.loading = false;
				}

				function addError(pError) {

					$uibModalInstance.dismiss(pError);
					$log.error(' activarPrefacturable ERROR.-', pError);
				};


				cleanFilters();
				vm.data.prefacturablesList = null;
				vm.formControl.showDivGuardado = false;
			}

			function getPrefacturables(pPrefacturable) {

				$log.debug('getPrefacturables ON.-');
				if (pPrefacturable.Id != null) {
					vm.formControl.loading = true;

					var _prefacturables = PrefacturableDataService.getPrefacturableById(pPrefacturable.Id)
						.then(searchOk, searchError);
				}

				function searchOk(pResults) {

					$log.debug('searchOk ON.-');
					vm.data.prefacturablesList = pResults;

					vm.paginacion.currentPage = 1;
					vm.paginacion.pageSize = 4;
					vm.paginacion.getPage();
					vm.formControl.loading = false;
					vm.formControl.stateLoading = false;

				}

				function searchError(pError) {

					vm.formControl.loading = false;

					$uibModalInstance.dismiss(pError);
					$log.error('Inicializar ERROR.-', pError);
				}

				//activate()
			}

			function deletePrefacturable(pPrefacturable, index) {

				$log.debug('deletePrefacturable ON.-');


				if (vm.data.prefacturables.length <= 1) {
					ModalService.error("Error: la prestacion no puede no tener un prefacturable");
				} else {

					if (index >= -1) {

						vm.data.prefacturables.splice(index, 1);
						var _prestacion = vm.data.prestacion;

						vm.formControl.loading = true;


						PrestacionGestionDataService.validarNewPrestacion(_prestacion)
							.then(addOk, addError);
					}
				}

				function addOk(pResponse) {

					$log.debug("ValidacionNew", pResponse);

					if (pResponse.IsOk === true) {
						vm.formControl.loading = true;
						PrestacionGestionDataService.newPrestacion(_prestacion)
							.then(function(pResp) {
								vm.formControl.loading = false;
								//$uibModalInstance.close("result ok");
								ModalService.success("Prestacion editada");
								activate();
							}).catch(function(pErr) {
								vm.formControl.loading = false;
								ModalService.error("Error de servidor");
								//$uibModalInstance.dismiss(pErr);
								$log.error('ValidacionNew .-', pErr);
							});
					} else {
						if (pResponse.Message != null)
							ModalService.error(pResponse.Message);
						else
							ModalService.error("Error de servidor");

						activate();
						vm.formControl.loading = false;
					}

					vm.formControl.loading = false;
				}

				function addError(pError) {

					$uibModalInstance.dismiss(pError);
					$log.error(' activarPrefacturable ERROR.-', pError);
				};
			}

			function cancel() {
				$uibModalInstance.dismiss('cancel');
			}

			/* PAGINACIÓN */

			function cleanFilters() {
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

				var _prestacion = PrestacionGestionDataService.getPrestacionById(vm.data.idPrestacionSelected);

				var _tipoPrefacturables = PrefacturableDataService.getAllTipoPrefacturable();


				$q.all([_prestacion,
						_tipoPrefacturables
					])
					.then(activateOk, activateError);
			}

			function activateOk(pResults) {

				$log.debug('Inicializar prestacion ON.-', pResults);
				
				vm.data.prestacion = pResults[0];
				vm.data.tipoPrefacturables = pResults[1];
				vm.data.prefacturables = vm.data.prestacion.Prefacturables;

				vm.formControl.loading = false;

			}

			function activateError(pError) {

				vm.formControl.loading = false;

				$uibModalInstance.dismiss(pError);
				$log.error('Inicializar ERROR.-', pError);
			}
		};
	};

	return module;

})();