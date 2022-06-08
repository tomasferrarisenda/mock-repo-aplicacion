/**
 * @author:			XX
 * @description:	Listado de Aparatos
 * @type:			Controller
 **/
export default (function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('AparatosListController', AparatosListController);

		AparatosListController.$inject = [
			'$state', 'Logger', '$filter', 'ModalService', 'AparatosDataService', 'AparatoLogicService'
		];

		function AparatosListController (
			$state, $log, $filter, ModalService, AparatosDataService, AparatoLogicService) { 

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('AparatosListController');
			/* ----------------------------------------- API Y VARIABLESES ----------------------------------------- */

			var vm = this;
			vm.title = {
				page : 'Listado de Aparatos'
			};

			vm.filter = {
				aparato :{},
				matricula : null,
				nombre : '',
				activos : true
			};

			vm.data = {
				listaAparatos: '',
				filtroDto : ''
			};

			vm.formControl = {
				loading : false,
				buscar : buscar,
				limpiarFiltros : limpiarFiltros,
				editar: editar,
				borrar: borrar,
				volver : volver
			};

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */
			function buscar()
			{
				vm.formControl.loading = true;
				vm.filter.aparato.NumeroMatricula = vm.filter.matricula || 0;
				vm.filter.aparato.Nombre    = vm.filter.nombre
				vm.filter.aparato.Activos   = vm.filter.activos
				$log.debug('vm.filter.aparato', vm.filter.aparato);
				 AparatosDataService.obtenerPorFiltros(vm.filter.aparato).then(function(listaAparatos){
				 	vm.data.listaAparatos = listaAparatos;
				 });
				vm.formControl.loading = false;
			}

			function limpiarFiltros(){
				vm.filter.matricula = 0;
				vm.filter.nombre = '';
				vm.filter.activos = true;
			}

			function guardarFiltros(){
				AparatosDataService.matriculaBusqueda = vm.filter.matricula;
				AparatosDataService.nombrebusqueda = vm.filter.nombre;
			}

			function editar(aparato){
				guardarFiltros();
				$state.go('profesionales.aparatos.edit', 
				{
					idAparato : aparato ? aparato.Id : null
				});
			}

			function borrar(row, fila) {
				ModalService.confirm('¿Desea eliminar el aparato '+row.Nombre+'?',
				function (pResult) {
					if (pResult) {
						AparatosDataService.eliminar(row.Id)
						.then(function (result) {
							if (result.IsOk === true) {
								vm.data.listaAparatos.Rows.splice(fila,1)
								ModalService.success("El aparato ha sido eliminado.");
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

			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */
			activate();

			function activate () {
				vm.formControl.loading = true;

				AparatosDataService.ObtenerNuevoFiltroBusqueda().then(function(filtroDto){
					vm.data.filtroDto = filtroDto;
					if(AparatosDataService.matriculaBusqueda != null) vm.filter.matricula = AparatosDataService.matriculaBusqueda;
					if(AparatosDataService.nombrebusqueda != null) vm.filter.nombre = AparatosDataService.nombrebusqueda;
					AparatosDataService.matriculaBusqueda = null;
					AparatosDataService.nombrebusqueda = null;
					buscar();
				});
				
				vm.formControl.loading = false;
			}
		}
	};
	return module;
})();