/**
 * @author:			Aldo Minoldo
 * @description:	Lista de organizaciones
 * @type:			Controller
 **/
import { ISupportDataService } from '../../../../support/basic/services';

export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function(module) {

		module.controller('MutualGestionListController', MutualGestionListController);

		MutualGestionListController.$inject = [
			'Logger', '$q', '$state', 'ModalService', 'MutualGestionDataService', 'SupportDataService'];

		function MutualGestionListController(
			$log, $q, $state, ModalService, MutualGestionDataService, SupportDataService: ISupportDataService) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('MutualGestionListController');
			$log.debug('ON.-');

			/* ----------------------------------------- API Y VARIABLESES ----------------------------------------- */
			var vm = this;

			vm.data = {
				mutuales: []
			};

			vm.title = {
				name : "Lista de mutuales"
			}

			vm.filter = {
				IdTipoAfiliado : 0,
				IdTipoMutual : 0,
				codigo : null,
				nombre : null,
				nombreCorto : null,
				filtroMutual: {},
				mutualElegida : [],
				currentPage : 0,
				soloActivos : true
			};

			vm.formControl = {
				volver: volver,
				buscar : buscar,
				editar : editar,
				borrar : borrar,
				buscarPagina : buscarPagina,
				limpiarFiltros: limpiarFiltros
			};

			vm.table = {
				export: exportarTable
			}

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			function limpiarFiltros() {
				vm.filter.mutualElegida = [];
				vm.filter.IdTipoAfiliado = '';
				vm.filter.IdTipoMutual = '';
				vm.filter.codigo = null;
				vm.filter.nombre = null;
				//vm.filter.nombreCorto = null;
				vm.filter.soloActivos = true;
			}
			
			function editar(idMutual) {
				guardarFiltrosDeBusqueda();
				obtenerMutualDto(idMutual).then(function(mutualDto){
					$state.go('financiadores.mutual.edit', { 
						mutualEdit: mutualDto,
						vieneDeListado : true,
						tabAIr : null
					});
				})
			}

			function borrar(pMutual, index) {
				ModalService.confirm('¿Confirma eliminar la mutual ' + pMutual.Nombre + '?',
				function(pResult) {
					if (pResult) {
						MutualGestionDataService.deleteMutual(pMutual.Id).then(function(result) {
							if (result.IsOk === false) {
								ModalService.warning("Verifique por favor. " + result.Message);
								return;
							}
							vm.data.mutuales.Rows.splice(index, 1);
							ModalService.success("Mutual eliminada.");
						}).catch(function(pErr) {
							ModalService.error("Error de servidor.");
						});
					}
				});
			}

			function guardarFiltrosDeBusqueda(){
				MutualGestionDataService.codigoMutualBusqueda = vm.filter.codigo;
				MutualGestionDataService.nombreMutualBusqueda = vm.filter.nombre;
				//MutualGestionDataService.nombreCortoBusqueda = vm.filter.nombreCorto;
				MutualGestionDataService.tipoAfiliadoBusqueda = vm.filter.IdTipoAfiliado;
				MutualGestionDataService.tipoMutualBusqueda = vm.filter.IdTipoMutual;
				MutualGestionDataService.soloActivosBusqueda = vm.filter.soloActivos;
				MutualGestionDataService.currentPage = vm.filter.currentPage;
			}

			function obtenerMutualDto(idMutual){
				var def = $q.defer();
				if(idMutual){
					MutualGestionDataService.ObtenerPorIdEditar(idMutual).then(function(mutualDto){
						def.resolve(mutualDto);
					});
				}
				else{
					MutualGestionDataService.obtenerNewMutual().then(function(mutualDto){
						def.resolve(mutualDto);
					});
				}
				return def.promise;
			}

			function volver() {
				$state.go('homesistemas');
			}
			
			function exportarTable(pExportation) {

				if (pExportation.isCsv()) {

					if (!vm.filter.codigo) vm.filter.codigo = 0;
					var filtroNombre = vm.filter.nombre ? vm.filter.nombre : "null";
					//var filtroNombreCorto = vm.filter.nombreCorto ? vm.filter.nombreCorto : "null";
					if (!vm.filter.IdTipoAfiliado) vm.filter.IdTipoAfiliado = 0;
					if (!vm.filter.IdTipoMutual) vm.filter.IdTipoMutual = 0;

					MutualGestionDataService.exportarListaToXls(vm.filter.codigo, filtroNombre, vm.filter.IdTipoAfiliado, 
						vm.filter.IdTipoMutual, vm.filter.filtroMutual.CurrentPage, vm.filter.filtroMutual.PageSize)
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
			function buscar(){
				if(!vm.filter.currentPage) vm.filter.currentPage = 1;
				buscarPagina({currentPage: vm.filter.currentPage});
			}

			function buscarPagina(pPagination) {

				vm.formControl.loading = true;

				vm.filter.currentPage = pPagination.currentPage;
				var currentPage = pPagination.currentPage;
				var pageSize = pPagination.pageSize || 10;
				vm.data.mutuales = [];

				vm.filter.filtroMutual.Codigo = vm.filter.codigo || 0;
				vm.filter.filtroMutual.Nombre = vm.filter.nombre;
				//vm.filter.filtroMutual.NombreCorto = vm.filter.nombreCorto;
				vm.filter.filtroMutual.IdTipoAfiliado = vm.filter.IdTipoAfiliado ? vm.filter.IdTipoAfiliado : 0;
				vm.filter.filtroMutual.IdTipoMutual = vm.filter.IdTipoMutual ? vm.filter.IdTipoMutual : 0;
				vm.filter.filtroMutual.SoloActivos = vm.filter.soloActivos;
				vm.filter.filtroMutual.CurrentPage = currentPage;
				vm.filter.filtroMutual.PageSize = pageSize;

				MutualGestionDataService.ObtenerPorFiltro(vm.filter.filtroMutual)
				.then(function(mutuales){
					vm.data.mutuales = mutuales;
					vm.formControl.loading = false;
				}, function (error) {
					$log.debug('error',error);
					vm.formControl.loading = false;
				});
			}

			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */
			activate();

			function activate() {



				SupportDataService.getAllTipoAfiliado().then(function(tipoAfiliado){
					vm.data.tipoAfiliado = tipoAfiliado;
				});
				SupportDataService.getAllTipoMutual().then(function(tipoMutual){
					vm.data.tipoMutual = tipoMutual;
				});
				MutualGestionDataService.generarFiltroMutual().then(function(pFiltros){
					vm.filter.filtroMutual = pFiltros;
					var filtrar = false;
					if(MutualGestionDataService.codigoMutualBusqueda != null){
						vm.filter.codigo = MutualGestionDataService.codigoMutualBusqueda;
						filtrar = true;
					}						
					if(MutualGestionDataService.nombreMutualBusqueda != null) {
						vm.filter.nombre = MutualGestionDataService.nombreMutualBusqueda;
						filtrar = true;
					}
					// if(MutualGestionDataService.nombreCortoBusqueda != null)
					// 	vm.filter.nombreCorto = MutualGestionDataService.nombreCortoBusqueda;
					if(MutualGestionDataService.tipoAfiliadoBusqueda != null){
						vm.filter.IdTipoAfiliado = MutualGestionDataService.tipoAfiliadoBusqueda;
						filtrar = true;
					}
					if(MutualGestionDataService.tipoMutualBusqueda != null){
						vm.filter.IdTipoMutual = MutualGestionDataService.tipoMutualBusqueda;
						filtrar = true;
					}
					if(MutualGestionDataService.soloActivosBusqueda != null)
						vm.filter.soloActivos = MutualGestionDataService.soloActivosBusqueda;
					if(MutualGestionDataService.currentPage != null)
						vm.filter.currentPage = MutualGestionDataService.currentPage;
					MutualGestionDataService.codigoMutualBusqueda = null;
					MutualGestionDataService.nombreMutualBusqueda = null;
					MutualGestionDataService.nombreCortoBusqueda = null;
					MutualGestionDataService.tipoAfiliadoBusqueda = null;
					MutualGestionDataService.tipoMutualBusqueda = null;
					MutualGestionDataService.soloActivosBusqueda = null;
					MutualGestionDataService.currentPage = null;
					
					if(filtrar){
						buscar();
					}
					//buscar();
				});
			}
		}
	};
	return module;
})();