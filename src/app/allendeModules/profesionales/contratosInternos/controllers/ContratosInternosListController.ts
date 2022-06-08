/**
 * @author:			XX
 * @description:	Listado de ContratosInternos
 * @type:			Controller
 **/
export default (function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('ContratosInternosListController', ContratosInternosListController);

		ContratosInternosListController.$inject = [
			'$state', 'Logger', '$filter', 'ModalService', 'ContratosInternosDataService', 'DateUtils'
		];

		function ContratosInternosListController (
			$state, $log, $filter, ModalService, ContratosInternosDataService, DateUtils) { 

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('ContratosInternosListController');

			/* ----------------------------------------- API Y VARIABLESES ----------------------------------------- */

			var vm = this;
			vm.today = new Date();
			
			vm.title = {
				page : 'Listado de Contratos Internos'
			};

			vm.filter = {
				fechaVigencia : null,
				contratableElegido : null,
				tipoContratableBusqueda : null,
				matriculaBusqueda : null,
				profesionalBusqueda : null,
				currentPage : null,
				activos : true,
				startDate : new Date('1900-01-01')
			};

			vm.data = {
				filtroContratoDto : '',
				contratos : ''
			};

			vm.formControl = {
				loading : false,
				volver : volver,
				buscar : buscar,
				buscarPagina : buscarPagina,
				limpiarFiltros : limpiarFiltros,
				editarContrato : editarContrato,
				borrarContrato : borrarContrato,
				nuevo : nuevo
			};

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			/* FORMULARIO */

			function limpiarFiltros(){
				vm.filter.fechaVigencia = new Date();
				vm.filter.contratableElegido.IdTipoEntidadContratoInterno = 1;
				vm.filter.contratableElegido.NumeroMatricula = null;
				vm.filter.contratableElegido.Nombre = '';
				vm.filter.contratableElegido.Id = 0;
				vm.filter.activos = true;
			}

			function guardarFiltros(){
				ContratosInternosDataService.tipoContratableBusqueda = vm.filter.contratableElegido.IdTipoEntidadContratoInterno;
				ContratosInternosDataService.matriculaBusqueda = vm.filter.contratableElegido.NumeroMatricula;
				ContratosInternosDataService.profesionalBusqueda = vm.filter.profesionalBusqueda;
				ContratosInternosDataService.contratableBusqueda = vm.filter.contratableElegido;
				ContratosInternosDataService.vigenciaBusqueda = vm.filter.fechaVigencia;
				ContratosInternosDataService.currentPage = vm.filter.currentPage;
			}

			function volver () {
				$state.go('homesistemas');
			}

			function buscar(){
				if(!vm.filter.currentPage) vm.filter.currentPage = 1;
				vm.formControl.buscarPagina({currentPage: vm.filter.currentPage});
			}

			function buscarPagina(pPagination) {
	 			vm.filter.currentPage = pPagination.currentPage;
				var currentPage = pPagination.currentPage;
	 			var pageSize = pPagination.pageSize || 10;

				vm.data.filtroContratoDto.FechaVigencia = DateUtils.parseToBe(vm.filter.fechaVigencia);
				vm.data.filtroContratoDto.IdTipoEntidadContratoInterno = vm.filter.contratableElegido ? vm.filter.contratableElegido.IdTipoEntidadContratoInterno : 1;
				vm.data.filtroContratoDto.IdEntidad = vm.filter.contratableElegido ? vm.filter.contratableElegido.Id : 0;
				vm.data.filtroContratoDto.Activos = vm.filter.activos;
				
				vm.data.filtroContratoDto.CurrentPage = currentPage;
				vm.data.filtroContratoDto.PageSize = pageSize;
				
				ContratosInternosDataService.ObtenerPorFiltrados(vm.data.filtroContratoDto)
				.then(function(contratosDto){
					vm.data.contratos = contratosDto;
				});
			}

			function nuevo(){
				ContratosInternosDataService.ObtenerNuevo()
				.then(function(contratoEdicion){
					$state.go('profesionales.contratosInternos.edit',
					{
						contratoEdit : contratoEdicion,
						esNuevo : true,
						matricula : null,
						idTipoContratable : null,
						desde : null,
						hasta : null
					});
				});
			}

			function editarContrato(row){
				guardarFiltros();
				ContratosInternosDataService.ObtenerPorId(row.Id)
				.then(function(contratoEdicion){
					$state.go('profesionales.contratosInternos.edit', 
					{
						contratoEdit : contratoEdicion,
						esNuevo : false,
						matricula : row.Matricula,
						idTipoContratable : contratoEdicion.IdTipoEntidadContratoInterno,
						desde : contratoEdicion.Desde,
						hasta : contratoEdicion.Hasta
					});
				});
			}

			function borrarContrato(fila){
				ModalService.warn('Método no implementado');
			}

			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */

			activate();

			function activate () {
				vm.formControl.loading = true;
				vm.filter.fechaVigencia = new Date();
				ContratosInternosDataService.CrearFiltroBusquedaContratoInterno().then(function(filtroContratoDto){
					vm.data.filtroContratoDto = filtroContratoDto;
					if (ContratosInternosDataService.tipoContratableBusqueda != null)
						vm.filter.tipoContratableBusqueda = ContratosInternosDataService.tipoContratableBusqueda;
					if (ContratosInternosDataService.matriculaBusqueda != null)
						vm.filter.matriculaBusqueda = ContratosInternosDataService.matriculaBusqueda;
					if (ContratosInternosDataService.profesionalBusqueda != null)
						vm.filter.profesionalBusqueda = ContratosInternosDataService.profesionalBusqueda;
					if (ContratosInternosDataService.contratableBusqueda != null)
						vm.filter.contratableElegido = ContratosInternosDataService.contratableBusqueda;
					if (ContratosInternosDataService.vigenciaBusqueda != null)
						vm.filter.fechaVigencia = ContratosInternosDataService.vigenciaBusqueda;
					if (ContratosInternosDataService.currentPage != null)
						vm.filter.currentPage = ContratosInternosDataService.currentPage;
					ContratosInternosDataService.tipoContratableBusqueda = null;
					ContratosInternosDataService.matriculaBusqueda = null;
					ContratosInternosDataService.profesionalBusqueda = null;
					ContratosInternosDataService.contratableBusqueda = null;
					ContratosInternosDataService.vigenciaBusqueda = null;
					ContratosInternosDataService.currentPage = null;
					buscar();
					vm.formControl.loading = false;
				})
			}
		}
	};

	return module;
})();