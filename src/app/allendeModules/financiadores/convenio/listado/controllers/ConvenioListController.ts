/**
 * @author:			Pedro Ferrer
 * @description:	Listado de Convenios
 * @type:			Controller
 **/
export default (function () {
	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.controller('ConvenioListController', ConvenioListController);

		ConvenioListController.$inject = [
			'$state', 'Logger', '$filter', 'AlertaService',
			'ModalService', 'DateUtils', 'ConvenioDataService', 'ConvenioLogicService'
		];

		function ConvenioListController(
			$state, $log, $filter, AlertaService,
			ModalService, DateUtils, ConvenioDataService, ConvenioLogicService) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('ConvenioListController');

			/* ----------------------------------------- API Y VARIABLESES ----------------------------------------- */

			var vm = this;
			vm.today = new Date();

			vm.title = {
				page: 'Listado de Convenios'
			};

			vm.filter = {
				fechaVigencia: '',
				tipoEstadoConvenioElegido: {},
				tipoMutualElegida: {},
				mutualElegida: {},
				codigoMutual: '',
				ultimaActualizacionAntesDe: '',
				currentPage: '',
				startDate : new Date('1900-01-01')
			};

			vm.data = {
				tiposEstadoConvenio: [],
				convenios: [],
				tiposMutual: []
			};

			vm.formControl = {
				volver: volver,
				buscar: buscar,
				limpiarFiltros: limpiarFiltros,
				nuevo: nuevo,

				buscarPagina: buscarPagina,
				editarConvenio: editarConvenio,
				borrarConvenio: borrarConvenio,
				copiarConvenio: copiarConvenio,
				loading: false,
				exportarConveniosExcel: exportarConveniosExcel,
			};

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			/* FORMULARIO */

			function volver() {
				$state.go('homesistemas');
			}

			function buscar() {
				if (!vm.filter.currentPage) vm.filter.currentPage = 1;
				vm.formControl.buscarPagina({ currentPage: vm.filter.currentPage });
			}

			function guardarFiltrosDeBusqueda() {
				ConvenioDataService.mutualFiltroBusqueda = vm.filter.mutualElegida;
				ConvenioDataService.codigoMutualFiltroBusqueda = vm.filter.codigoMutual;
				ConvenioDataService.fechaVigenciaFiltroBusqueda = vm.filter.fechaVigencia;
				ConvenioDataService.ultimaActualizacionAntesDe = vm.filter.ultimaActualizacionAntesDe;
				ConvenioDataService.estadoFiltroBusqueda = vm.filter.tipoEstadoConvenioElegido;
				ConvenioDataService.tipoMutualElegida = vm.filter.tipoMutualElegida;
				ConvenioDataService.currentPageFiltroBusqueda = vm.filter.currentPage;
			}

			function limpiarFiltros() {
				vm.filter.fechaVigencia = new Date();
				vm.filter.tipoEstadoConvenioElegido = null;
				vm.filter.tipoMutualElegida = null;
				vm.filter.mutualElegida = null;
				vm.filter.ultimaActualizacionAntesDe = new Date();
			}

			function nuevo() {
				ConvenioDataService.ObtenerNuevoConvenioDto().then(function (convenioNuevoDto) {
					$state.go('financiadores.convenios.edit',
						{
							convenioEdit: convenioNuevoDto,
							esNuevo: true,
							vigenciaDesde: null,
							vigenciaHasta: null,
							tabAIr : null
						});
				});
			}

			function buscarPagina(pPagination) {
				vm.filter.currentPage = pPagination.currentPage;
				var currentPage = pPagination.currentPage;
				var pageSize = pPagination.pageSize || 10;
				vm.data.convenios = [];

				vm.filter.filtroDto.FechaVigencia = DateUtils.parseToBe(vm.filter.fechaVigencia);
				vm.filter.filtroDto.IdTipoEstadoConvenio = vm.filter.tipoEstadoConvenioElegido ? vm.filter.tipoEstadoConvenioElegido.Id : 0;
				vm.filter.filtroDto.IdTipoMutual = vm.filter.tipoMutualElegida ? vm.filter.tipoMutualElegida.Id : 0;
				vm.filter.filtroDto.IdMutual = vm.filter.mutualElegida ? vm.filter.mutualElegida.Id : 0;
				vm.filter.filtroDto.UltimaActualizacionAntesDe = DateUtils.parseToBe(vm.filter.ultimaActualizacionAntesDe);
				vm.filter.codigoMutual = vm.filter.mutualElegida ? vm.filter.mutualElegida.Codigo : '';

				vm.filter.filtroDto.CurrentPage = currentPage;
				vm.filter.filtroDto.PageSize = pageSize;
				
				ConvenioDataService.ObtenerConveniosFiltrados(vm.filter.filtroDto).then(function (conveniosDto) {
					vm.data.convenios = conveniosDto;
				});
			}

			function editarConvenio(row) {
				guardarFiltrosDeBusqueda();
				ConvenioDataService.ObtenerConvenioParaEdicion(row.Id).then(function (convenioEdicion) {
					$state.go('financiadores.convenios.edit',
						{
							convenioEdit: convenioEdicion,
							esNuevo: false,
							vigenciaDesde: convenioEdicion.VigenciaDesde,
							vigenciaHasta: convenioEdicion.VigenciaHasta,
							tabAIr : null
						});
				});
			}

			function borrarConvenio(fila) {
				ModalService.confirm('¿Confirma eliminar el convenio de la mutual ' + fila.NombreMutual + '?',
					function (pResult) {
						if (pResult) {
							ConvenioDataService.EliminarConvenio(fila.Id).then(function (result) {
								if (result.IsOk === true) {
									AlertaService.NewSuccess("Confirmado", "El convenio ha sido eliminado.");
									buscar();
								}
								else {
									AlertaService.NewWarning("Alerta", "Por favor verifique: " + result.Message);
								}
							}).catch(function (pError) {
								AlertaService.NewError("Error", pError.message);
								return;
							});
						}
					});
			}


			function exportarConveniosExcel(){
				vm.filter.filtroDto.FechaVigencia = DateUtils.parseToBe(vm.filter.fechaVigencia);
				vm.filter.filtroDto.IdTipoEstadoConvenio = vm.filter.tipoEstadoConvenioElegido !== null && vm.filter.tipoEstadoConvenioElegido.Id !== undefined ? vm.filter.tipoEstadoConvenioElegido.Id : 0;
				vm.filter.filtroDto.IdTipoMutual = vm.filter.tipoMutualElegida !== null && vm.filter.tipoMutualElegida.Id !== undefined ? vm.filter.tipoMutualElegida.Id : 0;
				vm.filter.filtroDto.IdMutual = vm.filter.mutualElegida !== null && vm.filter.mutualElegida.Id !== undefined ? vm.filter.mutualElegida.Id : 0;
				vm.filter.filtroDto.UltimaActualizacionAntesDe = DateUtils.parseToBe(vm.filter.ultimaActualizacionAntesDe);
				vm.filter.codigoMutual = vm.filter.mutualElegida !== null && vm.filter.mutualElegida.Codigo !== undefined ? vm.filter.mutualElegida.Codigo : '';

				ConvenioDataService.ExportConveniosFiltrados(vm.filter.filtroDto).then((resul) =>{
					
		 
				})
			}

			function copiarConvenio(fila) {
				ConvenioLogicService.copiarConvenio(fila.Id).then(function (idConvenio) {
					//ModalService.success("IdConvenio = " + idConvenio)
				});
			}

			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */

			activate();
			
			function activate() {
				
				vm.formControl.loading = true;
				vm.filter.fechaVigencia = new Date();
				vm.filter.ultimaActualizacionAntesDe = new Date();

				ConvenioDataService.ObtenerTodosEstadosConvenios().then(function (tiposConvenio) {
					vm.data.tiposEstadoConvenio = tiposConvenio;
				});

				ConvenioDataService.ObtenerTodosTiposMutual().then(function (tiposMutual) {
					vm.data.tiposMutual = tiposMutual;
				});

				ConvenioDataService.ObtenerFiltroConvenioDto().then(function (filtroDto) {
					vm.filter.filtroDto = filtroDto;
					if (ConvenioDataService.codigoMutualFiltroBusqueda != null)
						vm.filter.codigoMutual = ConvenioDataService.codigoMutualFiltroBusqueda;
					if (ConvenioDataService.mutualFiltroBusqueda != null)
						vm.filter.mutualElegida = ConvenioDataService.mutualFiltroBusqueda;
					if (ConvenioDataService.fechaVigenciaFiltroBusqueda != null)
						vm.filter.fechaVigencia = ConvenioDataService.fechaVigenciaFiltroBusqueda;
					if (ConvenioDataService.ultimaActualizacionAntesDe != null)
						vm.filter.ultimaActualizacionAntesDe = ConvenioDataService.ultimaActualizacionAntesDe;
					if (ConvenioDataService.estadoFiltroBusqueda != null)
						vm.filter.tipoEstadoConvenioElegido = ConvenioDataService.estadoFiltroBusqueda;
					if (ConvenioDataService.tipoMutualElegida != null)
						vm.filter.tipoMutualElegida = ConvenioDataService.tipoMutualElegida;
					if (ConvenioDataService.currentPageFiltroBusqueda != null)
						vm.filter.currentPage = ConvenioDataService.currentPageFiltroBusqueda;
					ConvenioDataService.mutualFiltroBusqueda = null;
					ConvenioDataService.codigoMutualFiltroBusqueda = null;
					ConvenioDataService.fechaVigenciaFiltroBusqueda = null;
					ConvenioDataService.ultimaActualizacionAntesDe = null;
					ConvenioDataService.estadoFiltroBusqueda = null;
					ConvenioDataService.tipoMutualElegida = null;
					ConvenioDataService.currentPageFiltroBusqueda = null;
					buscar();
					vm.formControl.loading = false;
				});
			}
		}
	};

	return module;
})();