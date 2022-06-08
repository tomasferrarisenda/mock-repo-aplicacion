/**
 * @author:			Pedro Ferrer
 * @description:	ConvenioEdit
 * @type:			Controller
 **/
export default (function () {
	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.controller('ConvenioEditController', ConvenioEditController);

		ConvenioEditController.$inject = ['Logger', '$state', 'ModalService', 'User', 'CONVENIO_TABS', '$stateParams', 'ConvenioDataService', 'DateUtils', 'ConvenioLogicService'];

		function ConvenioEditController($log, $state, ModalService, User, TABS, $stateParams, ConvenioDataService, DateUtils, ConvenioLogicService) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('ConvenioEditController');

			/* ----------------------------------------- API Y VARIABLESES ----------------------------------------- */

			var vm = this;
			vm.today = new Date();
			vm.tabs = TABS;

			vm.title = {
				name: '',
				icon: ''
			};

			vm.data = {
				convenioEdit: ''
			};

			vm.formData = {
			};

			vm.filter = {
				mutualElegida: '',
				vigenciaDesde: null,
				vigenciaHasta: null,
				estadoConvenio: '',
				estadosConvenio: '',
				esNuevo: null
			};

			vm.formControl = {
				reloadPage: reloadPage,
				volver: volver,
				guardar: guardar,
				cambioEstado : cambioEstado,
				loading: false
			};

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			/* FORMULARIO */
			function reloadPage() {
				$state.reload();
			}

			function volver() {
				$state.go('financiadores.convenios.list');
			}

			function cambioEstado(){
				$stateParams.convenioEdit.IdEstadoConvenio = vm.filter.estadoConvenio.Id;
				$stateParams.convenioEdit.NombreEstadoConvenio = vm.filter.estadoConvenio.Nombre;
			}

			function guardar() {
				ConvenioLogicService.guardarConvenio(vm.data.convenioEdit, vm.filter.mutualElegida,
					vm.filter.vigenciaDesde, vm.filter.vigenciaHasta, vm.filter.estadoConvenio.Id)
					.then(function (result) {
						if (result.IsOk === true) {
							$state.go('financiadores.convenios.list');
						}
					});
			}

			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */

			activate();

			function activate() {
				if (!$stateParams.convenioEdit) {
					volver();
					return;
				}
				vm.formControl.loading = true;
				vm.filter.esNuevo = $stateParams.esNuevo;
				vm.title.name = vm.filter.esNuevo ? 'Nuevo convenio' : 'Editar convenio';
				vm.title.icon = vm.filter.esNuevo ? 'NEW2' : 'EDIT';
				vm.data.convenioEdit = $stateParams.convenioEdit;

				if (!vm.filter.esNuevo) vm.filter.codigoMutual = vm.data.convenioEdit.CodigoFinanciador;
				vm.filter.vigenciaDesde = $stateParams.esNuevo ? DateUtils.parseToFe(vm.data.convenioEdit.VigenciaDesde) : $stateParams.vigenciaDesde;
				vm.filter.vigenciaHasta = $stateParams.esNuevo ? DateUtils.parseToFe(vm.data.convenioEdit.VigenciaHasta) : $stateParams.vigenciaHasta;

				ConvenioDataService.ObtenerTodosEstadosConvenios()
					.then(function (estadosConvenio) {
						vm.filter.estadosConvenio = estadosConvenio;
						for (var i = vm.filter.estadosConvenio.length - 1; i >= 0; i--) {
							if (vm.filter.estadosConvenio[i].Id == vm.data.convenioEdit.IdEstadoConvenio) {
								vm.filter.estadoConvenio = vm.filter.estadosConvenio[i];
								break;
							}
						}
						vm.formControl.loading = false;

						if($stateParams.tabAIr !== null)
							$state.go($stateParams.tabAIr);
					});
			}
		}
	};
	return module;
})();