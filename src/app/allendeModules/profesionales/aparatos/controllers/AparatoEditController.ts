/**
 * @author:			jdelmastro
 * @description:	Controller para crear/editar aparatos (recursos)
 * @type:			Controller
 **/
export default (function() {
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {
		module.controller('AparatoEditController', AparatoEditController);

		AparatoEditController.$inject = [
			'$q', 'Logger', 'AparatosDataService', 'ModalService', '$stateParams', '$state', 'APARATOS_TABS'];

		function AparatoEditController(
			$q, $log, AparatosDataService, ModalService, $stateParams, $state, APARATOS_TABS) {
			
			/* ------------------------------------------------ LOG ------------------------------------------------ */
			$log = $log.getInstance('AparatosEditController');

			/* ----------------------------------------- API Y VARIABLESES ----------------------------------------- */

			var vm = this;

			vm.tabs = APARATOS_TABS,

			vm.title = {
				name : '',
				icon : ''
			};
			
			vm.data = {
				aparato: '',
				editaMatricula : false
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
				AparatosDataService.Guardar(vm.data.aparato).then(function(result){
					if (result.IsOk === false) {
						ModalService.warning("Verifique por favor. " + result.Message);
					}
					else {
						ModalService.success("Se ha guardado el aparato.");
						volver();
					}
				});
			}

			function volver () {
				$state.go('profesionales.aparatos.list');
			}

			/* ------------------------------ ACTIVATE ------------------------------ */

			activate();
			
			function activate () {
				vm.formControl.loading = true;

				vm.title.icon = $stateParams.idAparato === null ? 'NEW2' : 'EDIT';
				vm.title.name = $stateParams.idAparato === null ? 'Nuevo aparato' : 'Editar aparato';
				vm.data.editaMatricula = $stateParams.idAparato !== null;

				obtenerAparatoDto().then(function(aparatoEdit){
					vm.data.aparato = aparatoEdit;
					$state.go('profesionales.aparatos.edit.general');
					vm.formControl.loading = false;
				});
			}

			function obtenerAparatoDto(){
				var def = $q.defer();
				if($stateParams.idAparato){
					AparatosDataService.obtenerPorId($stateParams.idAparato).then(function(aparato){
						def.resolve(aparato);
					});
				}
				else{
					AparatosDataService.obtenerNuevo().then(function(aparato){
						def.resolve(aparato);
					});
				}
				return def.promise;
			}
		}
	}
	return module;
})();