import * as angular from 'angular';

/**
 * @author:			Pedro Ferrer
 * @description:	Edit Contratos Internos
 * @type:			Controller
 **/
export default (function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('EditContratosInternosController', EditContratosInternosController);

		EditContratosInternosController.$inject = ['Logger', '$state', 'ModalService', 'CONTRATOS_INTERNOS_TABS', '$stateParams', 'ContratosInternosDataService', 'DateUtils', 'ContratosInternosLogicService'];

		function EditContratosInternosController ($log, $state, ModalService, TABS, $stateParams, ContratosInternosDataService, DateUtils, ContratosInternosLogicService) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('EditContratosInternosController');
			/* ----------------------------------------- API Y VARIABLESES ----------------------------------------- */

			var vm = this;
			vm.today = new Date();
			vm.tabs = TABS;
			
			vm.title = {
				name : '',
				icon : ''
			};

			vm.data = {
				contratoEdit : ''
			};

			vm.formData = {
			};

			vm.filter = {
				contratableElegido : '',
				desde : '',
				hasta : '',
				esNuevo : null,
				matricula : null,
				startDate : new Date('1900-01-01'),
				changeFechaDesde : changeFechaDesde,
				fechadesdeMin : ''
			};

			vm.formControl = {
				reloadPage : reloadPage,
				volver : volver,
				guardar : guardar,
				loading : false
			};

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			/* FORMULARIO */
			function reloadPage () {
				$state.reload();
			}

			function volver () {
				$state.go('profesionales.contratosInternos.list');
			}

			function guardar () {
				var contratoEdit = angular.copy(vm.data.contratoEdit)
				contratoEdit.FechaVigenciaEximicionGanancias = DateUtils.parseToBe(contratoEdit.FechaVigenciaEximicionGanancias);
				ContratosInternosLogicService.guardarContrato(contratoEdit, vm.filter.contratableElegido, vm.filter.desde, vm.filter.hasta)
				.then(function(result){
					if(result.IsOk === true){
						$state.go('profesionales.contratosInternos.list');
					}
				});
			}

			function changeFechaDesde(){
				setTimeout(() => {
					vm.filter.fechadesdeMin = vm.filter.desde;
					vm.filter.fechadesdeMin.setDate(vm.filter.desde.getDate() - 1);
						
				});	

			}

			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */


			activate();

			function activate () {
				if(!$stateParams.contratoEdit){
					volver();
					return;
				}
				$state.go('profesionales.contratosInternos.edit.general');
				
				vm.formControl.loading = true;
				vm.filter.esNuevo = $stateParams.esNuevo;
				vm.filter.matricula = $stateParams.matricula;
				vm.filter.idTipoContratable = $stateParams.idTipoContratable;

				vm.title.name = vm.filter.esNuevo ? 'Nuevo Contrato Interno' : 'Editar Contrato Interno';
				vm.title.icon = vm.filter.esNuevo ? 'NEW2': 'EDIT';
				vm.data.contratoEdit = $stateParams.contratoEdit;
				vm.data.contratoEdit.FechaVigenciaEximicionGanancias = DateUtils.parseToFe(vm.data.contratoEdit.FechaVigenciaEximicionGanancias);

				vm.filter.desde = $stateParams.esNuevo ? DateUtils.parseToFe(vm.data.contratoEdit.Desde) : DateUtils.parseToFe($stateParams.desde);
				vm.filter.hasta = $stateParams.esNuevo ? DateUtils.parseToFe(vm.data.contratoEdit.Hasta) : DateUtils.parseToFe($stateParams.hasta);
				setTimeout(() => {
					vm.filter.fechadesdeMin = vm.filter.desde;
					vm.filter.fechadesdeMin.setDate(vm.filter.desde.getDate() - 1);
						
				});
				vm.formControl.loading = false
			}
		}
	};
	return module;
})();