import * as angular from 'angular';

export default (function () {
	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.controller('CodigosNomencladorListController', CodigosNomencladorListController);

		CodigosNomencladorListController.$inject = ['$log', '$q', 'AlertaService', 'ModalService', 'User', 'CodigosNomencladorDataService', 'CodigosNomencladorLogicService'];

		function CodigosNomencladorListController($log, $q, AlertaService, ModalService, User, CodigosNomencladorDataService, CodigosNomencladorLogicService) {

			var vm = this;

			vm.user = User;

			vm.title = {
				icono: 'LIST',
				name: 'Listado de Códigos de Nomenclador'
			};

			vm.data = {
				codigosNomenclador: [],
				nomencladores: [],
			};

			vm.filterDto = {};

			vm.filter = {
				nomenclador: '',
				codigo: '',
				nombre: '',
				codigoNBU: '',
				currentPage: 1,
				clean: cleanFilters,
				validar: validarFilters
			};

			vm.formControl = {
				error: true,
				loading: false,
				reloadPage: activate,
				buscar: buscar,
				agregar: agregar
			};

			vm.table = {
				export: exportarTable,
				sort: sortTable,
				getPage: getPage
			};

			/* ---------------------------------------- IMPLEMENTACIÓN ---------------------------------------- */

			function validarFilters() {

			}

			function cleanFilters() {
				vm.filter.codigosNomenclador = '';
				vm.filter.nomenclador = '';
				vm.filter.codigo = '';
				vm.filter.nombre = '';
				vm.filter.codigoNBU = '';
			}

			function agregar() {
				CodigosNomencladorDataService.obtenerNuevoCodigoNomenclador()
					.then(function (result) {
						CodigosNomencladorLogicService.editarCodigoNomenclador(result).then(editOk, editError);
					})
					.catch(function (pError) {
						AlertaService.NewError("Error", pError.message);
						return;
					});
			}

			vm.editar = function (row) {
				CodigosNomencladorDataService.obtenerCodigoNomencladorPorId(row.Id)
					.then(function (result) {
						CodigosNomencladorLogicService.editarCodigoNomenclador(result).then(editOk, editError);
					})
					.catch(function (pError) {
						AlertaService.NewError("Error", pError.message);
						return;
					});
			};

			function editOk(pResult) {
				if (pResult != 'cancel') {
					buscar();
				}
			}

			function editError(pError) {
				//AlertaService.NewError('edit codigo nomenclador error.-', pError); // Esta mal informado el error TODO
			}

			vm.borrar = function (row) {
				ModalService.confirm('¿Desea eliminar el código de nomenclador?',
					function (pResult) {
						if (pResult) {
							CodigosNomencladorDataService.eliminarCodigoNomenclador(row.Id)
								.then(function (result) {
									if (result.IsOk === false) {
										AlertaService.NewError("Error", result.Message);
									}
									else {
										AlertaService.NewSuccess("Confirmado", "El código de nomenclador ha sido eliminado.");
										buscar();
									}
								})
								.catch(function (pError) {
									AlertaService.NewError("Error", pError.message);
									return;
								});
						}
					});
			};

			function crearFilterDto() {

				// Pagination
				vm.filterDto.UsePagination = vm.filterDto.UsePagination || true;
				vm.filterDto.CurrentPage = vm.filterDto.CurrentPage || 1;
				vm.filterDto.PageSize = vm.filterDto.PageSize || 10;

				// Sorting
				vm.filterDto.SortedColumns = vm.filterDto.SortedColumns || [];

				// Filters
				vm.filterDto.Nombre = vm.filter.nombre;
				if (vm.filterDto.Nombre == '') {
					vm.filterDto.Nombre = ' ';
				}

				if (vm.filter.codigo != '') {
					vm.filterDto.Codigo = vm.filter.codigo;
				} else {
					vm.filterDto.Codigo = 0;
				}

				if (vm.filterDto.CodigoNbu != '') {
					vm.filterDto.CodigoNbu = vm.filter.codigoNBU;
				} else {
					vm.filterDto.CodigoNbu = 0;
				}
				var idNomenclador = 0;
				if (vm.filter.nomenclador != null && !angular.isUndefined(vm.filter.nomenclador.Id) && vm.filter.nomenclador.Id != 0 && vm.filter.nomenclador.Id != '') {
					idNomenclador = vm.filter.nomenclador.Id;
				}
				vm.filterDto.IdNomenclador = idNomenclador;
			}

			/**
			 * Busca por cambio de pagina o tamaño de pagina
			 * @param  {Pagination} pPagination
			 */
			function getPage(pPagination) {
				if (pPagination) {
					vm.filterDto.CurrentPage = pPagination.currentPage || 1;
					vm.filterDto.PageSize = pPagination.pageSize || 10;
				} else {
					vm.filterDto.CurrentPage = 1;
					vm.filterDto.PageSize = 10;
				}
				// Guardo la pagina actual
				// vm.filter.currentPage = pPagination.currentPage;
				crearFilterDto();

				buscarCodigos(vm.filterDto);
			}

			/**
			 * Busca codigos por filtroDTO
			 * @param  {FiltroDTO} pFiltro
			 */
			function buscarCodigos(pFiltro) {
				if (pFiltro) {
					vm.formControl.loading = true;
					CodigosNomencladorDataService.guardarCodigoNomencladorPorFiltro(pFiltro)
						.then(buscarPaginaOk, buscarPaginaError);
				}

				function buscarPaginaOk(pResult) {
					vm.data.codigosNomenclador = pResult;
					vm.formControl.loading = false;
				}

				function buscarPaginaError() {
					vm.formControl.loading = false;
					// AlertaService.NewError("Error", pError.message);
				}
			}

			/**
			 * Busca por cambio en orden de columnas
			 * @param  {Sorting} pSorting
			 */
			function sortTable(pSorting) {
				vm.filterDto.SortedColumns = pSorting.SortedColumns;
				crearFilterDto();
				buscarCodigos(vm.filterDto);
			}

			/**
			 * Busca sin ningun parametro
			 */
			function buscar() {
				crearFilterDto();
				buscarCodigos(vm.filterDto);
			}

			function exportarTable(pExportation) {
				//$log.debug('exportarTable',pExportation);

				if (pExportation.isCsv()) {
					crearFilterDto();
					//vm.formControl.loading = true;
					//$log.debug('dtoFiltro', vm.filterDto);
					//CodigosNomencladorDataService.exportarListaCodigosToXls(vm.filterDto).then(exportarOk,exportarError);
					CodigosNomencladorDataService.exportarListaCodigosToXls(vm.filterDto.Nombre, vm.filterDto.Codigo, vm.filterDto.CodigoNbu,
						vm.filterDto.IdNomenclador, vm.filterDto.CurrentPage, vm.filterDto.PageSize).then(exportarOk, exportarError);

				}
				function exportarOk() {
					//vm.formControl.loading = false;
				}

				function exportarError(pError) {
					vm.formControl.loading = false;
					AlertaService.NewError("Error", pError.message);
				}
			}

			/* ---------------------------------------- ACTIVATE ---------------------------------------- */

			activate();

			function activate() {
				vm.formControl.loading = true;
				CodigosNomencladorDataService.idCodigoNomenclador = 0;

				var _nomencladores = CodigosNomencladorDataService.getAllNomencladores();
				var _filtro = CodigosNomencladorDataService.obtenerNuevoFiltroCodigoNomenclador();
				$q.all([_nomencladores, _filtro])
					.then(activateOk, activateError);
			}

			function activateOk(results) {
				vm.data.nomencladores = results[0];
				vm.filterDto = results[1];

				vm.formControl.error = false;

				//buscar();

				vm.formControl.loading = false;
			}

			function activateError(pError) {
				vm.formControl.loading = false;
				AlertaService.NewError("Error", pError.message);
			}
		}

	};

	return module;
})();