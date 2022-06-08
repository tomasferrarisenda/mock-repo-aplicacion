/**
 * @author:			XX
 * @description:	Listado de Equipos
 * @type:			Controller
 **/
export default (function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('EquiposListController', EquiposListController);

		EquiposListController.$inject = [
			'$state', 'Logger', '$filter', 'ModalService', 'EquiposDataService', 'EquipoLogicService'
		];

		function EquiposListController (
			$state, $log, $filter, ModalService, EquiposDataService, EquipoLogicService) { 

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('EquiposListController');
			/* ----------------------------------------- API Y VARIABLESES ----------------------------------------- */

			var vm = this;
			vm.title = {
				page : 'Listado de Equipos'
			};

			vm.filter = {
				equipo : {},
				matricula : null,
				nombre : '',
				currentpage : null,
				activos : true
			};

			vm.data = {
				listaEquipos: ''
			};

			vm.formControl = {
				loading : false,
				buscar : buscar,
				limpiarFiltros : limpiarFiltros,
				editar: editar,
				borrar: borrar,
				volver : volver
			};

			vm.table = {
				export : exportarTable
			}

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */
			
			function buscar()
			{
				vm.formControl.loading = true;
				vm.filter.equipo.NumeroMatricula = vm.filter.matricula || 0;
				vm.filter.equipo.Nombre    = vm.filter.nombre
				vm.filter.equipo.Activos   = vm.filter.activos
				EquiposDataService.obtenerPorFiltros(vm.filter.equipo).then(function(listaEquipos){
					vm.data.listaEquipos = listaEquipos;
				});
				vm.formControl.loading = false;
			}

			function limpiarFiltros(){
				vm.filter.matricula = 0;
				vm.filter.nombre = '';
				vm.filter.activos = true;
			}

			function guardarFiltros(){
				EquiposDataService.matriculaBusqueda = vm.filter.matricula;
				EquiposDataService.nombreBusqueda = vm.filter.nombre;
			}

			function editar(equipo){
				guardarFiltros();
				$state.go('profesionales.equipos.edit', 
				{
					idEquipo : equipo ? equipo.Id : null
				});
			}

			function borrar(row, fila) {
				ModalService.confirm('¿Desea eliminar el equipo '+row.Nombre+'?',
				function (pResult) {
					if (pResult) {
						EquiposDataService.eliminar(row.Id)
						.then(function (result) {
							if (result.IsOk === true) {
								vm.data.listaEquipos.Rows.splice(fila,1)
								ModalService.success("El equipo ha sido eliminado.");
							}
							else
								ModalService.warning("Verifique por favor. " + result.Message);
						})
					}
				});
			};

			function volver () {
				$state.go('homesistemas');
			}

			function exportarTable(pExportation) {

				if (pExportation.isCsv()) {

					EquiposDataService.exportarListaToXls(vm.filter.matricula, vm.filter.nombre)
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
				if(EquiposDataService.matriculaBusqueda != null)
					vm.filter.matricula = EquiposDataService.matriculaBusqueda;
				if(EquiposDataService.nombreBusqueda != null)
					vm.filter.nombre = EquiposDataService.nombreBusqueda;
				EquiposDataService.matriculaBusqueda = null;
				EquiposDataService.nombreBusqueda = null;
				buscar();
				vm.formControl.loading = false;
			}
		}
	};
	return module;
})();