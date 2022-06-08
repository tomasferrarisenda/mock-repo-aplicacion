/**
 * @author:			drobledo
 * @description:	Profesionales Externos List
 * @type:			Controller
 **/

export default (function () {
	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.controller('ProfesionalesExternosListController', ProfesionalesExternosListController);

		ProfesionalesExternosListController.$inject = ['$log', '$state', 'ModalService', 'ICON_LIST',
			'ProfesionalesExternosDataService', 'ProfesionalesExternosLogicService'];

		function ProfesionalesExternosListController($log, $state, ModalService, ICON_LIST,
			ProfesionalesExternosDataService, ProfesionalesExternosLogicService) {

			var vm = this;

			vm.ICON_LIST = ICON_LIST
			vm.title = {
				page: 'Listado de Profesionales Externos',
				icon: 'EXTERNAL'
			};

			vm.data = {
				profesionalesExternos: [],
				filtroProfesionales: {}
			};

			vm.filter = {
				apellido: '',
				nombre: '',
				matricula: 0,
				currentPage: 1
			};

			vm.formControl = {
				buscar: buscar,
				buscarPagina: buscarPagina,
				limpiarFiltros: limpiarFiltros,
				borrarProfesional: borrarProfesional,
				editarProfesional: editarProfesional,
				volver: volver
			};

			/* ---------------------------------------- IMPLEMENTACIÓN ---------------------------------------- */

			function volver() {
				$state.go('homesistemas');
			}

			function buscar() {
				if (vm.filter.currentPage === 0) vm.filter.currentPage = 1;
				vm.formControl.buscarPagina({ currentPage: vm.filter.currentPage });
			}

			function limpiarFiltros() {
				vm.filter.nombre = '';
				vm.filter.apellido = '';
				vm.filter.matricula = 0;
			}

			function borrarProfesional(fila) {
				ModalService.confirm('¿Desea eliminar el profesional externo ' + fila.Apellido + ', ' + fila.Nombre + '?',
					function (pResult) {
						if (pResult) {
							ProfesionalesExternosDataService.eliminarProfesional(fila.Id)
								.then(function (result) {
									if (result.IsOk == false) {
										ModalService.warning("Por favor verifique: " + result.Message);
									}
									else {
										ModalService.success("El profesional ha sido eliminado.");
										buscar();
									}
								})
								.catch(function (pError) {
									ModalService.error("Error en el servidor.", pError.message);
									return;
								});
						}
					});
			}

			function editarProfesional(profesionalId) {
				ProfesionalesExternosLogicService.editProfesional(profesionalId).then(function (result) {
					buscar();
				});
			}

			function buscarPagina(paginacion) {
				vm.filter.currentPage = paginacion.currentPage;

				vm.data.filtroProfesionales.NumeroMatricula = vm.filter.matricula;
				vm.data.filtroProfesionales.Nombre = vm.filter.nombre;
				vm.data.filtroProfesionales.Apellido = vm.filter.apellido;

				vm.data.filtroProfesionales.CurrentPage = paginacion.currentPage;
				if (vm.data.filtroProfesionales.CurrentPage == 0) vm.data.filtroProfesionales.CurrentPage = 1;
				vm.data.filtroProfesionales.PageSize = paginacion.pageSize || vm.data.filtroProfesionales.PageSize || 10;
				vm.data.filtroProfesionales.UsePagination = true;

				ProfesionalesExternosDataService.obtenerListadoProfesionales(vm.data.filtroProfesionales)
					.then(function (listadoProfesionales) {
						vm.data.profesionalesExternos = listadoProfesionales;
					});
			}

			/* ---------------------------------------- ACTIVATE ---------------------------------------- */

			activate();

			function activate() {
				ProfesionalesExternosDataService.obtenerNuevoFiltro()
					.then(function (filtroDto) {
						vm.data.filtroProfesionales = filtroDto;
						buscar();
					});
			}
		}
	};
	return module;
})();