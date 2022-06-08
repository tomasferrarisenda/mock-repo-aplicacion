/**
 * @author:			drobledo
 * @description:	Profesionales Externos Edit
 * @type:			Controller
 **/
import { ISupportDataService } from '../../../../support/basic/services';

export default (function () {
	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.controller('ProfesionalesExternosEditController', ProfesionalesExternosEditController);

		ProfesionalesExternosEditController.$inject = ['$log', '$q', 'SupportDataService', 'ProfesionalesDataService', 
			'ProfesionalesExternosLogicService', 'ProfesionalesExternosDataService', 'IdProfesionalEditar', '$uibModalInstance', 'ModalService'];

		function ProfesionalesExternosEditController($log, $q, SupportDataService: ISupportDataService, ProfesionalesDataService, 
			ProfesionalesExternosLogicService, ProfesionalesExternosDataService, IdProfesionalEditar, $uibModalInstance, ModalService) {

			var vm = this;

			vm.title = {
				name: '',
				icon: ''
			};

			vm.data = {
				profesionalesExternos: [],
				profesionalEdit: {}
			};

			vm.filter = {
				matricula: '',
				apellido: '',
				nombre: '',
				IdTipoDocumentoElegido: '',
				tiposDocumento: '',
				numeroDocumento: '',
				especialidad: ''
			};

			vm.formControl = {
				cancel: cancel,
				guardar: guardar
			};

			/* ---------------------------------------- IMPLEMENTACIÓN ---------------------------------------- */

			function cancel() {
				$uibModalInstance.dismiss('cancel');
			}

			function guardar() {
				vm.data.profesionalEdit.IdTipoDocumento = vm.filter.IdTipoDocumentoElegido ? vm.filter.IdTipoDocumentoElegido : 0;

				ProfesionalesExternosDataService.guardar(vm.data.profesionalEdit)
					.then(function (result) {
						if (result.IsOk) {
							
							vm.data.profesionalEdit.Id = result.IdEntidadValidada
							vm.data.profesionalEdit.IdTipoSolicitante = 2 // IdTipoSolicitante = 2  (Externo)
							$uibModalInstance.close(vm.data.profesionalEdit);
							ModalService.success("Se ha guardado el profesional externo.");
						}
						else {
							ModalService.warning("Verifique por favor. " + result.Message);
						}
					});
			}

			/* ---------------------------------------- ACTIVATE ---------------------------------------- */

			activate();

			function activate() {
				vm.title.icon = IdProfesionalEditar === 0 ? 'NEW2' : 'EDIT';
				vm.title.name = IdProfesionalEditar === 0 ? 'Nuevo Profesional Externo' : 'Editar Profesional Externo';

				ProfesionalesExternosLogicService.obtenerProfesionalDto(IdProfesionalEditar).then(function(profesionalEdit){
					vm.data.profesionalEdit = profesionalEdit;
					ProfesionalesDataService.ObtenerTodosTipoDocumento().then(function(tiposDocumento) {
						vm.filter.tiposDocumento = tiposDocumento;
						if (vm.data.profesionalEdit.IdTipoDocumento > 0) vm.filter.IdTipoDocumentoElegido = vm.data.profesionalEdit.IdTipoDocumento;
					});
				});
			}
		}
	};
	return module; 
})();