/**
 * @author:			jdelmastro
 * @description:	Controller para crear/editar equipos (recursos)
 * @type:			Controller
 **/
export default (function() {
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {
		module.controller('EquipoEditController', EquipoEditController);

		EquipoEditController.$inject = [
			'$q', 'Logger', 'EquiposDataService', 'ModalService', '$stateParams', '$state', 'EQUIPOS_TABS'];

		function EquipoEditController(
			$q, $log, EquiposDataService, ModalService, $stateParams, $state, EQUIPOS_TABS) {
			
			/* ------------------------------------------------ LOG ------------------------------------------------ */
			$log = $log.getInstance('EquiposListController');

			/* ----------------------------------------- API Y VARIABLESES ----------------------------------------- */

			var vm = this;

			vm.tabs = EQUIPOS_TABS,

			vm.title = {
				name : '',
				icon : ''
			};
			
			vm.data = {
				equipo: '',
				editaMatricula: false
			};

			vm.formControl = {
				guardar: guardar,
				volver: volver,
				error: true,
				loading: false
			};

			/* ------------------------------------------ IMPLEMENTACIÓN ------------------------------------------ */

			function guardar(esValido) {
				if(!esValido) return;
				EquiposDataService.Guardar(vm.data.equipo).then(function(result){
					if (result.IsOk === false) {
						ModalService.warning("Verifique por favor. " + result.Message);
					}
					else {
						ModalService.success("Se ha guardado el equipo.");
						volver();
					}
				});
			}

			function volver () {
				$state.go('profesionales.equipos.list');
			}

			/* ------------------------------ ACTIVATE ------------------------------ */

			activate();
			
			function activate () {
				vm.formControl.loading = true;

				vm.title.icon = $stateParams.idEquipo === null ? 'NEW2' : 'EDIT';
				vm.title.name = $stateParams.idEquipo === null ? 'Nuevo equipo' : 'Editar equipo';
				vm.data.editaMatricula = $stateParams.idEquipo !== null;

				obtenerEquipoDto().then(function(equipoEdit){
					vm.data.equipo = equipoEdit;
					$state.go('profesionales.equipos.edit.general');
					vm.formControl.loading = false;
				});
			}

			function obtenerEquipoDto(){
				var def = $q.defer();
				if($stateParams.idEquipo){
					EquiposDataService.obtenerPorId($stateParams.idEquipo).then(function(equipo){
						def.resolve(equipo);
					});
				}
				else{
					EquiposDataService.obtenerNuevo().then(function(equipo){
						def.resolve(equipo);
					});
				}
				return def.promise;
			}
		}
	}
	return module;
})();