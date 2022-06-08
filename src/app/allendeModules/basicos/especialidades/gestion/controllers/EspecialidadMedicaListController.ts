/**
 * @author 			ppautasso
 * @description 	description
 */
export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('EspecialidadMedicaListController', EspecialidadMedicaListController);

		// Inyeccion de dependencia
		EspecialidadMedicaListController.$inject = ['$filter', 'orderByFilter', 'Logger', '$q',
			'ServiciosGestionLogicService',
			'ModalService','ServiciosGestionDataService',
			'Title', 'Module'
		];

		// Constructor del Controller
		function EspecialidadMedicaListController($filter, orderByFilter, $log, $q,
			ServiciosGestionLogicService,
			ModalService,ServiciosGestionDataService,
			Title, Module) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('EspecialidadMedicaListController');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			var vm = this;

			vm.title = {
				module: Module,
				page: Title
			};

			vm.order = {};

			vm.formControl = {
				esAll: false,
				loading: false,
				stateLoading: false,
				reloadPage: activate
			};

			vm.paginacion = {
				currentPage: 0,
				pageSize: 0,
				totalItems: 0,
				pageChanged: getPage,
				getPage: getPage
			};

			vm.servicio = {
				new: newServicio,
				view: verServicio,
				edit: editServicio,
				delete: deleteServicio
			}

			vm.data = {
				servicios: {}
			}

			vm.filter = {
				id: '',
				clean: cleanFilters,
				validar: validarFilters
			};

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			/* FORMULARIO */

			function verServicio(pServicio) {

				var _id = pServicio.Id;
				ServiciosGestionLogicService.openServicio(_id);

			}

			function newServicio() {

				$log.debug('newServicio OK.-');


				ServiciosGestionLogicService.newServicio()
					.then(newServicioOk, newServicioError);

				function newServicioOk(pResult) {
					activate();
				}

				function newServicioError(pError) {

					$log.error('newServicio OK.-', pError);

				}
			}


			function editServicio(pServicio) {

				$log.debug('newServicio OK.-');

				var _id = pServicio.Id;
				ServiciosGestionLogicService.editServicio(_id)
					.then(editServicioOk, editServicioError);

				function editServicioOk(pResult) {
					activate();
				}

				function editServicioError(pError) {

					$log.error('newServicio OK.-', pError);

				};

			}

			function deleteServicio(pServicio) {

				$log.debug('deleteHabitacion OK.-');

				var _id = pServicio.Id;
				ModalService.confirm('¿Desea eliminar el servicio ' + pServicio.Nombre + '?',
					function (pResult) {
						if (pResult) {
							vm.formControl.loading = true;

							ServiciosGestionDataService.validarDeleteServicio(pServicio.Id)
								.then(function (pResponse) {

									$log.debug("ValidacionEliminar", pResponse);

									if (pResponse.IsOk === true) {
										vm.formControl.loading = true;
										ServiciosGestionDataService.deleteServicio(pServicio.Id)
											.then(function (pResp) {
												vm.formControl.loading = true;
												ModalService.success("Servicio Borrado");
												activate();
											}).catch(function (pError) {
												vm.formControl.loading = false;
												ModalService.error("Error de servidor");
												$log.error('ValidacionEliminar .-', pError);
											});
									} else {
										if (pResponse.Message != null)
											ModalService.error(pResponse.Message);
										else
											ModalService.error("Error de servidor");
										vm.formControl.loading = false;

									}
								})
								.catch(function (pError) {
									vm.formControl.loading = false;
									//ModalService.error("Error de servidor");
									$log.error('ValidacionEliminar .-', pError);
								});
						}
					});
			}

			/* PAGINACIÓN */

			function cleanFilters() {
				vm.filter.id = '';
				vm.paginacion.pageChanged();
			}

			function validarFilters() {
				if (vm.filter.sucursal == null)
					vm.filter.sucursal = '';

				if (vm.filter.estadoCama == null)
					vm.filter.estadoCama = '';

				vm.order = {
					id: 1,
					value: 'Numero',
					descripcion: 'Habitación (Asc)',
					reverse: false
				}

			}

			function getPage() {


				var begin = ((vm.paginacion.currentPage - 1) * vm.paginacion.pageSize);
				var end = begin + vm.paginacion.pageSize;
				vm.filter.validar();
				vm.data.servicios = orderByFilter(vm.data.servicios, vm.order.value, vm.order.reverse);

				vm.filter.servicios = $filter('filter')
					(vm.data.servicios, {
						Id: vm.filter.id
					});

				vm.paginacion.totalItems = vm.filter.servicios.length;
				vm.filter.servicios = vm.filter.servicios.slice(begin, end);
			}

			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */

			activate();

			function activate() {

				vm.formControl.loading = true;
				vm.formControl.stateLoading = true;

				var _servicios = ServiciosGestionDataService.getAll();

				$q.all([_servicios
						//,_habitaciones
						//,_sucursales
					])
					.then(activateOk, activateError);

				function activateOk(pResults) {

					vm.data.servicios = pResults[0];

					vm.paginacion.currentPage = 1;
					vm.paginacion.pageSize = 5;
					vm.paginacion.getPage();
					vm.formControl.loading = false;
					vm.formControl.stateLoading = false;

					$log.debug('Inicializar OK.-');
				}

				function activateError(pError) {
					vm.formControl.loading = false;
					vm.formControl.stateLoading = false;

					//$uibModalInstance.dismiss(pError);
					$log.error('Inicializar ERROR.-', pError);
				}
			}

		};
	};

	return module;

})();