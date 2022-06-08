/**
 * @author:			Aldo Minoldo
 * @description:	Lista de organizaciones
 * @type:			Controller
 **/

 export default (function() {
	'use strict';

	const module = { init : (ngModule: any) => {} };

	module.init = function(module) {

		module.controller('OrganizacionGestionListController', OrganizacionGestionListController);

		OrganizacionGestionListController.$inject = ['Logger', '$q', '$filter', 'orderByFilter', '$state', 'ModalService', 
			'OrganizacionGestionDataService','OrganizacionGestionLogicService'];

		function OrganizacionGestionListController($log, $q, $filter, orderByFilter, $state, ModalService, 
			OrganizacionGestionDataService, OrganizacionGestionLogicService)
		{
			/* ------------------------------------------------ LOG ------------------------------------------------ */
			$log = $log.getInstance('OrganizacionGestionListController');
			/* ----------------------------------------- API Y VARIABLESES ----------------------------------------- */

			var vm = this;

			vm.title = {
				name : 'Listado de Organizaciones'
			};

			vm.data = {
				organizaciones: {}
			};

			vm.filter = {
				organizacionElegida : {},
				codigo : null,
				nombre : null,
				filtroOrganizacion : null,
				currentPage : 1,
				soloActivos : true
			};

			vm.formControl = {
				volver: volver,
				buscar : buscar,
				limpiarFiltros : limpiarFiltros,
				buscarPagina : buscarPagina,
				editar : editar,
				borrar : borrar,
			};

			function limpiarFiltros() {
				vm.filter.organizacionElegida = {};
				vm.filter.organizacionElegida.RazonSocial = null;
				vm.filter.codigo = null;
				vm.filter.nombre = null;
				vm.filter.soloActivos = true;
			}

			vm.table = {
				export: exportarTable
			}

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			function editar(idOrganizacion) {
				guardarCriteriosBusqueda();
				obtenerOrganizacionDto(idOrganizacion).then(function(organizacionDto){
					$state.go('financiadores.organizacion.edit', { 
						Organizacion: organizacionDto
					});
				})
			}
			
			function obtenerOrganizacionDto(idOrganizacion){
				var def = $q.defer();
				if(idOrganizacion){
					OrganizacionGestionDataService.GetOne(idOrganizacion).then(function(organizacionDto){
						def.resolve(organizacionDto);
					});
				}
				else{
					OrganizacionGestionDataService.obtenerNewOrganizacion().then(function(organizacionDto){
						def.resolve(organizacionDto);
					});
				}
				return def.promise;
			}

			function borrar(organizacion, index) {
				ModalService.confirm('¿Desea eliminar la organización ' + organizacion.RazonSocial + '?',
				function(pResult) {
					if (pResult) {
						OrganizacionGestionDataService.deleteOrganizacion(organizacion.Id).then(function(result) {
							if (result.IsOk === false) {
								ModalService.warning("Verifique por favor. " + result.Message);
								return;
							}
							vm.data.organizaciones.Rows.splice(index, 1);
							ModalService.success("Organización borrada.");
						}).catch(function(pErr) {
							ModalService.error("Error de servidor.");
						});
					}
				});
			}

			function guardarCriteriosBusqueda() {
				OrganizacionGestionDataService.codigoBusqueda = vm.filter.codigo;
				OrganizacionGestionDataService.razonSocialBusqueda =  vm.filter.nombre;
				OrganizacionGestionDataService.currentPage = vm.filter.currentPage;	
			}

			function volver() {
				$state.go('homesistemas');
			}

			function exportarTable(pExportation) {

				if (pExportation.isCsv()) {

					if (!vm.filter.codigo) vm.filter.codigo = 0;
					var filtroNombre = vm.filter.nombre ? vm.filter.nombre : "null";

					OrganizacionGestionDataService.exportarListaToXls(vm.filter.codigo, filtroNombre, vm.filter.currentPage, 10)
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

			/* ------------------------------------------- PAGINACIÓN ------------------------------------------- */

			function buscar() {
				if(!vm.filter.currentPage) vm.filter.currentPage = 1;
				buscarPagina({currentPage: vm.filter.currentPage});
			}

			function buscarPagina(pPagination) {
				vm.filter.currentPage = pPagination.currentPage;
				var currentPage = pPagination.currentPage;
				var pageSize = pPagination.pageSize || 10;
				vm.data.organizaciones = [];

				vm.filter.filtroOrganizacion.Codigo = vm.filter.codigo || 0;
				vm.filter.filtroOrganizacion.RazonSocial = vm.filter.nombre;
				vm.filter.filtroOrganizacion.CurrentPage = currentPage;
				vm.filter.filtroOrganizacion.PageSize = pageSize;
				vm.filter.filtroOrganizacion.SoloActivos = vm.filter.soloActivos;

				$log.debug("FILTRO", vm.filter.filtroOrganizacion);

				OrganizacionGestionDataService.ObtenerPorFiltro(vm.filter.filtroOrganizacion)
				.then(function(organizaciones){
					vm.data.organizaciones = organizaciones;
					$log.debug("vm.data.organizaciones", vm.data.organizaciones);

				}); 
			}

			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */

			activate();

			function activate() {
				OrganizacionGestionDataService.generarFiltroOrganizacion()
				.then(function(filtroDto){
					vm.filter.filtroOrganizacion = filtroDto;
					if(OrganizacionGestionDataService.codigoBusqueda != null)
						vm.filter.codigo = OrganizacionGestionDataService.codigoBusqueda;
					if(OrganizacionGestionDataService.razonSocialBusqueda != null)
						vm.filter.nombre = OrganizacionGestionDataService.razonSocialBusqueda;
					if(OrganizacionGestionDataService.currentPage != null)
						vm.filter.currentPage = OrganizacionGestionDataService.currentPage;
					OrganizacionGestionDataService.codigoBusqueda = 0;
					OrganizacionGestionDataService.razonSocialBusqueda = null;
					OrganizacionGestionDataService.currentPage = null;
					buscar();
				});
			}
		}
	};

	return module;
})();
