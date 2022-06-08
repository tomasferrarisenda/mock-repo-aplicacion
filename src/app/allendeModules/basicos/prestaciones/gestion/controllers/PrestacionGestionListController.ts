/**
 * @author 			ppautasso
 * @description 	description
 */
export default (function () {

	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.controller('PrestacionGestionListController', PrestacionGestionListController);

		// Inyeccion de dependencia
		PrestacionGestionListController.$inject = ['Logger', '$filter', 'orderByFilter',
			'PrestacionGestionDataService', 'PrestacionGestionLogicService', 'PrestacionGestionAuthService',
			'ModalService', 'User', '$state'
		];

		// Constructor del Controller
		function PrestacionGestionListController($log, $filter, orderByFilter,
			PrestacionGestionDataService, PrestacionGestionLogicService, PrestacionGestionAuthService,
			ModalService, User, $state) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('PrestacionGestionListController');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			var vm = this;

			vm.title = {
				page: 'Gestión de Prestaciones'
			};
			vm.order = {};

			vm.formControl = {
				esAll: false,
				loading: false,
				stateLoading: false,
				reloadPage: activate,

				borrarPrestacion: borrarPrestacion,
				editarPrestacion: editPrestacion,
				verPrestacion: verPrestacion,
				new: newPrestacion,
				codigo: 0,
				nombre: '',
				matricula: 0,
				buscar: buscar,
				buscarPagina: buscarPagina,
				limpiarFiltros: limpiarFiltros,
				prefacturable: '',//Lo traje desde Filter para probar
				volver: volver
			};

			vm.paginacion = {
				currentPage: '',
				pageSize: '',
				totalItems: 0,
				pageChanged: getPage,
				getPage: getPage
			};

			vm.data = {
				prestaciones: [],
				filtroDto: {},
				listadoPrestaciones: [],
			};

			vm.filter = {
				validar: PrestacionGestionDataService.validarFilters,
			};

			vm.table = {
				export : exportarTable
			}

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			/* FORMULARIO */

			function verPrestacion(pPrestacion) {
				var _id = pPrestacion.Id;
				PrestacionGestionLogicService.openPrestacion(_id);
			}

			function newPrestacion() {
				$log.debug('newPrestacion OK.-');
				PrestacionGestionLogicService.newPrestacion(0)
					.then(newPrestacionOk, newPrestacionError);
				function newPrestacionOk(pResult) {
					activate();
				}
				function newPrestacionError(pError) {
					$log.debug('newPrestacion OK.-', pError);
				}
			}

			function editPrestacion(pPrestacion) {
				$log.debug('editarPrestacion OK.-', pPrestacion);
				var _id = pPrestacion.Id;

				PrestacionGestionLogicService.newPrestacion(_id)
					.then(editPrestacionOk, editPrestacionError);

				function editPrestacionOk(pResult) {
					//Cuando realizamos una busqueda directamente desde el Código y al borrar la prefactura buscada, actualice la lista.
					for (let i = 0; i < vm.data.listadoPrestaciones.Rows.length; i++) { //Recorrer la lista de Prestación para que no se elimien.
						if(vm.data.listadoPrestaciones.Rows[i].Id === pResult.Dto.Id){
							vm.data.listadoPrestaciones.Rows[i] = pResult.Dto;
							break;
						}
					}
				}

				function editPrestacionError(pError) {
					$log.debug('editPrestacion OK.-', pError);
				};

			}

			function borrarPrestacion(pPrestacion, index) {
				ModalService.confirm('¿Desea eliminar la prestacion ' + pPrestacion.Nombre + ' ?',
					function (pResult) {
						if (pResult) {
							vm.formControl.loading = true;
							PrestacionGestionDataService.borrarPrestacion(pPrestacion.Id).then(function (pResp) {

								if (pResp.IsOk) {
									ModalService.success("Prestacion Borrada");
									if (vm.data.listadoPrestaciones.Row) {
										for (let i = 0; i < vm.data.listadoPrestaciones.Row.length; i++) {
											if (vm.data.listadoPrestaciones.Row[i].Id === pPrestacion.Id) {
												vm.data.listadoPrestaciones.Row ? vm.data.listadoPrestaciones.Row.splice(index, 1) : null;
												//this.AlertaService.NewSuccess("La prestación ha sido eliminada.");
												break;
											}
										}
									}
											//Se coloca el listado y se pone en Null para que al borrar no cargue la busqueda simplemente quede el listado vacio
											vm.data.listadoPrestaciones=null;
								} else { 
									//this.AlertaService.NewWarning("No se pudo eliminar la prestacion: " + pResp.Message);
									ModalService.warning("No se pudo eliminar la prestacion: " + pResp.Message);
								}
												
								
							}).catch(function (pError) {
								vm.formControl.loading = false;
								ModalService.error("Error de servidor");
								$log.error('ValidacionEliminar .-', pError);
							});
							vm.formControl.loading = false;
						}
					});
				limpiarFiltros();
			}

			function getPage() {
				$log.debug('Get Page ON'); // Preguntar a Pedro!!!
				var begin = ((vm.paginacion.currentPage - 1) * vm.paginacion.pageSize);
				var end = begin + vm.paginacion.pageSize;
				//vm.filter.validar();
				vm.filter.validar,
					vm.data.prestaciones = orderByFilter
						(vm.data.prestaciones, vm.order.value, vm.order.reverse);

				vm.filter.prestaciones = $filter('filter')
					(vm.data.prestaciones, {
						Id: vm.filter.id,
						Nombre: vm.filter.nombrePrestacion
					});

				vm.paginacion.totalItems = vm.filter.prestaciones.length;
				vm.filter.prestaciones = vm.filter.prestaciones.slice(begin, end);
			}

			function exportarTable(pExportation) {

				if (pExportation.isCsv()) {
					PrestacionGestionDataService.exportarListaToXls()
						.then(exportarOk, exportarError);
				}

				function exportarOk() {
					//vm.formControl.loading = false;
				}

				function exportarError(pError) {
					vm.formControl.loading = false;
					ModalService.error("Error: " + pError.message);
				}
			}

			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */

			function volver() {
				$state.go('homesistemas');
			}


			function buscar() {
				if (!vm.paginacion.currentPage) vm.paginacion.currentPage = 1;
				vm.formControl.buscarPagina({ currentPage: vm.paginacion.currentPage });
			}

			function limpiarFiltros() { // Boton Limpiar
				vm.formControl.codigo = 0;
				vm.formControl.nombre = '';
				vm.formControl.prefacturable = '';
			}

			function buscarPagina(pPagination) {
				vm.filter.currentPage = pPagination.currentPage;
				var currentPage = pPagination.currentPage;
				var pageSize = pPagination.pageSize || 10;

				vm.data.filtroDto.NombrePrestacion = vm.formControl.nombre;
				vm.data.filtroDto.Numero = vm.formControl.codigo;
				vm.data.filtroDto.IdPrefacturable = vm.formControl.prefacturable ? vm.formControl.prefacturable.Id : 0;
				vm.data.filtroDto.IdTipoPrefacturable = vm.formControl.prefacturable ? vm.formControl.prefacturable.IdTipo : 0;

				vm.data.filtroDto.CurrentPage = currentPage;
				vm.data.filtroDto.PageSize = pageSize;

				$log.debug('MI FILTRO', vm.data.filtroDto)
				PrestacionGestionDataService.ObtenerPorFiltroParaLista(vm.data.filtroDto).then(
					function (listadoPrestaciones) {
						vm.data.listadoPrestaciones = listadoPrestaciones;
						vm.formControl.loading = false;
						$log.debug('vm.data.listadoPrestaciones', vm.data.listadoPrestaciones)
					});
			}

			function activate() {

				vm.paginacion.limpiarFiltros;
				vm.paginacion.currentPage = 1;
				vm.paginacion.pageSize = 10;
				vm.paginacion.getPage();
				vm.formControl.loading = false;
				vm.formControl.stateLoading = false;
			}

			//Agrega Prestacion Gestion Data Service / Obtener por Filtro para descargar Planilla
			PrestacionGestionDataService.ObtenerFiltro().then((filtroDto) => {
				vm.data.filtroDto = filtroDto;
				//buscar()  //No deberia tirar resultados para que no moleste al Back

			});

		}

	}
		;

	return module;

})();