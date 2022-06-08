/**
 * @author:			Jorge Basiluk
 * @description:	Listado de SociedadProfesionales
 * @type:			Controller
 **/
export default (function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('SociedadProfesionalesListController', SociedadProfesionalesListController);

		SociedadProfesionalesListController.$inject = [
			'$state', 'Logger', '$filter', 'ModalService', 'AlertaService', 'SociedadProfesionalesDataService'
		];

		function SociedadProfesionalesListController (
			$state, $log, $filter, ModalService, AlertaService, SociedadProfesionalesDataService) { 

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('SociedadProfesionalesListController');

			/* ----------------------------------------- API Y VARIABLESES ----------------------------------------- */

			var vm = this;

			vm.title = {
				page : 'Listado de Sociedades de Profesionales'
			};

			vm.filter = {
				numeroMatricula : '',
				nombre : '',
				currentPage : 1,
				activos : true,
			};

			vm.data = {
				sociedades : []
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
				vm.filter.activos = true;
			}

			function guardarFiltros(){
				SociedadProfesionalesDataService.matriculaBusqueda = vm.filter.numeroMatricula || 0;
				SociedadProfesionalesDataService.nombreBusqueda = vm.filter.nombre;
				SociedadProfesionalesDataService.currentPage = vm.filter.currentPage;
			}

			function nuevo(){
				SociedadProfesionalesDataService.ObtenerNuevaSociedadDto()
				.then(function(sociedadNuevoDto){
					$state.go('profesionales.sociedadProfesionales.edit',
					{
						sociedadEdit : sociedadNuevoDto,
						esNuevo : true
					});
				});
			}

			function buscarPagina(pPagination) {
	 			vm.filter.currentPage = pPagination.currentPage;
	 			var currentPage = pPagination.currentPage;
	 			var pageSize = pPagination.pageSize || 10;
				vm.data.sociedades = [];

				vm.filter.filtroDto.Nombre = vm.filter.nombre;
				vm.filter.filtroDto.NumeroMatricula = vm.filter.numeroMatricula || 0;
				vm.filter.filtroDto.Activos = vm.filter.activos;
				vm.filter.filtroDto.CurrentPage = currentPage;
				vm.filter.filtroDto.PageSize = pageSize;

				SociedadProfesionalesDataService.ObtenerSociedadesPorFiltros(vm.filter.filtroDto)
				.then(function(sociedadesDto){
					vm.data.sociedades = sociedadesDto;
				});
			}

			function editar(row){
				//$log.debug('edit sociedad', row)
				guardarFiltros();
				SociedadProfesionalesDataService.ObtenerSociedadParaEdicion(row.Id)
				.then(function(socieadadEdicion){
					//$log.debug('sociedadedit dto', socieadadEdicion)
					$state.go('profesionales.sociedadProfesionales.edit', 
					{
						sociedadEdit : socieadadEdicion,
						esNuevo : false
					});
				});
			}

			function borrar(fila){
				ModalService.confirm('¿Confirma eliminar la sociedad?',
				function (pResult) {
					if (pResult) {
						SociedadProfesionalesDataService.EliminarSociedad(fila.Id)
							.then(function (result) {
								if (result.IsOk === true) {
									AlertaService.NewSuccess("Confirmado", "La sociedad ha sido eliminado.");
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

					SociedadProfesionalesDataService.exportarListaToXls(filtroMatricula, filtroNombre, vm.filter.currentPage, 10)
						.then(exportarOk, exportarError);
				}

				function exportarOk() {
					//vm.formControl.loading = false;
				}

				function exportarError(pError) {
					vm.formControl.loading = false;
					ModalService.error("Error: " + pError.Message);
				}
			}

			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */

			activate();

			function activate () {
				vm.formControl.loading = true;
				
				SociedadProfesionalesDataService.ObtenerFiltroBusquedaSociedadesDto()
				.then(function(filtroDto){
					vm.filter.filtroDto = filtroDto;
					if(SociedadProfesionalesDataService.matriculaBusqueda != null)
						vm.filter.numeroMatricula = SociedadProfesionalesDataService.matriculaBusqueda;
					if(SociedadProfesionalesDataService.nombreBusqueda != null)
						vm.filter.nombre = SociedadProfesionalesDataService.nombreBusqueda;
					if(SociedadProfesionalesDataService.currentPage != null)
						vm.filter.currentPage = SociedadProfesionalesDataService.currentPage;
					SociedadProfesionalesDataService.matriculaBusqueda = null;
					SociedadProfesionalesDataService.nombreBusqueda = null;
					SociedadProfesionalesDataService.currentPage = null;
					buscar();
					vm.formControl.loading = false;
				});
			}
		}
	};

	return module;
})();