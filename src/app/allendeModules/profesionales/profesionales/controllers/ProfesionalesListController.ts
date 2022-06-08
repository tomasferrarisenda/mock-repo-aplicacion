/**
 * @author:			Jorge Basiluk
 * @description:	Listado de Profesionales
 * @type:			Controller
 **/
import { IProfesionalesDataService } from '../services';

export default (function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('ProfesionalesListController', ProfesionalesListController);

		ProfesionalesListController.$inject = [
			'$state', 'Logger', '$filter', 'ModalService', 'AlertaService', 'ProfesionalesDataService'];

		function ProfesionalesListController (
			$state, $log, $filter, ModalService, AlertaService, ProfesionalesDataService: IProfesionalesDataService) { 

			/* ------------------------------------------------ LOG ------------------------------------------------ */
			$log = $log.getInstance('ProfesionalesListController');

			/* ----------------------------------------- API Y VARIABLESES ----------------------------------------- */

			var vm = this;

			vm.title = {
				page : 'Listado de Profesionales'
			};

			vm.filter = {
				numeroMatricula : '',
				nombre : '',
				apellido : '',
				currentPage : 1,
				activos : true,
				filtroDto : {}
			};

			vm.data = {
				profesionales : []
			};

			vm.formControl = {
				volver : volver,
				buscar : buscar,
				limpiarFiltros : limpiarFiltros,
				nuevo : nuevo,
				buscarPagina : buscarPagina,
				editar : editar,
				borrar : borrar,
				reloadPage: activate,
				loading : false
			};

			vm.table = {
				export : exportarTable
			}

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			/* FORMULARIO */

			function volver () {
				$state.go('homesistemas');
			}

			function buscar(){
				if(!vm.filter.currentPage) vm.filter.currentPage = 1;
				vm.formControl.buscarPagina({currentPage: vm.filter.currentPage});
			}

			function limpiarFiltros(){
				vm.filter.numeroMatricula = '';
				vm.filter.nombre = '';
				vm.filter.apellido = '';
				vm.filter.activos = true;
			}

			function guardarFiltros(){
				ProfesionalesDataService.matriculaBusqueda = vm.filter.numeroMatricula;
				ProfesionalesDataService.nombreBusqueda = vm.filter.nombre;
				ProfesionalesDataService.apellidoBusqueda = vm.filter.apellido;
				ProfesionalesDataService.currentPage = vm.filter.currentPage;
			}

			function nuevo(){
				ProfesionalesDataService.ObtenerNuevoProfesionalDto()
				.then(function(profesionalNuevoDto){
					$state.go('profesionales.profesionales.edit',
					{
						profesionalEdit : profesionalNuevoDto,
						esNuevo : true
					});
				});
			}

			function buscarPagina(pPagination) {
	 			vm.filter.currentPage = pPagination.currentPage;
	 			var currentPage = pPagination.currentPage;
	 			var pageSize = pPagination.pageSize || 10;
				vm.data.profesionales = [];

				vm.filter.filtroDto.Nombre = vm.filter.nombre;
				vm.filter.filtroDto.Apellido = vm.filter.apellido;
				vm.filter.filtroDto.NumeroMatricula = vm.filter.numeroMatricula || 0;
				vm.filter.filtroDto.Activos = vm.filter.activos;

				vm.filter.filtroDto.CurrentPage = currentPage;
				vm.filter.filtroDto.PageSize = pageSize;
				$log.debug('vm.filter.filtroDto', vm.filter.filtroDto)

				ProfesionalesDataService.ObtenerProfesionalesPorFiltros(vm.filter.filtroDto)
				.then(function(profesionalesDto){
					vm.data.profesionales = profesionalesDto;
				});
			}

			function editar(row){
				guardarFiltros();
				ProfesionalesDataService.ObtenerProfesionalParaEdicion(row.Id)
				.then(function(profesionalEdicion){
					$state.go('profesionales.profesionales.edit', 
					{
						profesionalEdit : profesionalEdicion,
						esNuevo : false
					});
				});
			}

			function borrar(fila){
				ModalService.confirm('¿Confirma eliminar el profesional?',
				function (pResult) {
					if (pResult) {
						ProfesionalesDataService.EliminarProfesional(fila.Id)
							.then(function (result) {
								if (result.IsOk === true) {
									AlertaService.NewSuccess("Confirmado", "El profesional ha sido eliminado.");
									buscar();
								}
								else {
									AlertaService.NewWarning("Alerta", "Por favor verifique: " + result.Message);
								}
							})
							.catch(function (pError) {
								AlertaService.NewError("Error", pError.message);
								return;
							});
					}
				});
			}

			function exportarTable(pExportation) {

				if (pExportation.isCsv()) {

					var filtroMatricula = vm.filter.numeroMatricula ? vm.filter.numeroMatricula : 0; 
					var filtroNombre = vm.filter.nombre ? vm.filter.nombre : "null";
					var filtroApellido = vm.filter.apellido ? vm.filter.apellido : "null";

					ProfesionalesDataService.exportarListaToXls(filtroMatricula, filtroNombre, filtroApellido, 
						vm.filter.filtroDto.CurrentPage, vm.filter.filtroDto.PageSize)
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

			activate();

			function activate () {
				vm.formControl.loading = true;
				
				ProfesionalesDataService.ObtenerFiltroBusquedaProfesionalesDto()
				.then(function(filtroDto){
					vm.filter.filtroDto = filtroDto;
					if(ProfesionalesDataService.matriculaBusqueda != null)
						vm.filter.numeroMatricula = ProfesionalesDataService.matriculaBusqueda;
					if(ProfesionalesDataService.nombreBusqueda != null)
						vm.filter.nombre = ProfesionalesDataService.nombreBusqueda;
					if(ProfesionalesDataService.apellidoBusqueda != null)
						vm.filter.apellido = ProfesionalesDataService.apellidoBusqueda;
					if(ProfesionalesDataService.currentPage != null)
						vm.filter.currentPage = ProfesionalesDataService.currentPage;
					ProfesionalesDataService.matriculaBusqueda = null;
					ProfesionalesDataService.nombreBusqueda = null;
					ProfesionalesDataService.apellidoBusqueda = null;
					ProfesionalesDataService.currentPage = null;
					buscar();
					vm.formControl.loading = false;
				});
			}
		}
	};

	return module;
})();