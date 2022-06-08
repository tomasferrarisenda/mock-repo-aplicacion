/**
 * @author:			Pedro Ferrer
 * @description:	Participacion
 * @type:			Controller
 **/
import { ISupportDataService, IAmbitoDataService } from '../../../../support/basic/services';

export default (function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('ParticipacionTplController', ParticipacionTplController);

		ParticipacionTplController.$inject = [
			'Logger', '$state', 'ModalService', 'ContratosInternosDataService', '$scope', '$uibModalInstance', 'idParticipacionEdit', 
			'$q', '$stateParams', 'idContratoEdit', 'SupportDataService', 'AmbitoDataService'];

		function ParticipacionTplController (
			$log, $state, ModalService, ContratosInternosDataService, $scope, $uibModalInstance, idParticipacionEdit, 
			$q, $stateParams, idContratoEdit, SupportDataService: ISupportDataService, AmbitoDataService : IAmbitoDataService) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('ParticipacionTplController');
			/* ----------------------------------------- API Y VARIABLESES ----------------------------------------- */

			var vm = this;
			
			vm.title = {
				name : '',
				icon : ''
			};

			vm.data = {
				participacionEdit : ''
			};

			vm.filter = {
				IdSucursalElegida : '',
				sucursales : '',
				IdAmbitoElegido : '',
				ambitos : '',
				IdServicioElegido : '',
				servicios : '',
				IdTipoRetencionElegida : '',
				tiposRetencion : '',
				profesional : '',
				prefacturable : ''
			};

			vm.formControl = {
				cancel : cancel,
				guardar : guardar
			};

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			/* FORMULARIO */
			function guardar(isValid) {
				vm.data.participacionEdit.IdSucursal = vm.filter.IdSucursalElegida ? vm.filter.IdSucursalElegida : 0;
				vm.data.participacionEdit.IdServicio = vm.filter.IdServicioElegido ? vm.filter.IdServicioElegido : 0;
				vm.data.participacionEdit.IdAmbitoAtencion = vm.filter.IdAmbitoElegido ? vm.filter.IdAmbitoElegido : 0;
				vm.data.participacionEdit.IdTipoRetencionContratoInterno = vm.filter.IdTipoRetencionElegida ? vm.filter.IdTipoRetencionElegida : 0;
				vm.data.participacionEdit.PorcentajeRetencion = vm.filter.porcentaje;
				vm.data.participacionEdit.IdContratoInterno = idContratoEdit;
				vm.data.participacionEdit.IdTipoPrefacturable = vm.filter.prefacturable.IdTipo;
				vm.data.participacionEdit.IdPrefacturable = vm.filter.prefacturable.Id;
			
				ContratosInternosDataService.ParticipacionGuardar(vm.data.participacionEdit)
				.then(function(result){
					if (result.IsOk === false) {
						ModalService.warning("Verifique por favor. " + result.Message);
					}
					else {
						$uibModalInstance.close(result);
						ModalService.success("Se ha guardado la participación.");
					}
				});
			}
			
			function cancel() {
				$uibModalInstance.dismiss('close');
			}

			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */

			activate();

			function activate () {

				vm.title.icon = idParticipacionEdit === null ? 'NEW2' : 'EDIT';
				vm.title.name = idParticipacionEdit === null ? 'Nueva Participación' : 'Editar Participación';

				obtenerParticipacionDto().then(function(participacionEdit){
					vm.data.participacionEdit = participacionEdit;

					vm.filter.porcentaje = vm.data.participacionEdit.PorcentajeRetencion;
					
					ContratosInternosDataService.SucursalObtenerTodos().then(function(sucursales){
						vm.filter.sucursales = sucursales;
						if(vm.data.participacionEdit.IdSucursal !== 0) vm.filter.IdSucursalElegida = vm.data.participacionEdit.IdSucursal;
					});

					ContratosInternosDataService.ServicioObtenerTodos().then(function(servicio){
						vm.filter.servicios = servicio;
						if(vm.data.participacionEdit.IdServicio !== 0) vm.filter.IdServicioElegido = vm.data.participacionEdit.IdServicio;
					});

					AmbitoDataService.getAll().then(function(ambitos){
						vm.filter.ambitos = ambitos;
						if(vm.data.participacionEdit.IdAmbitoAtencion !== 0) vm.filter.IdAmbitoElegido = vm.data.participacionEdit.IdAmbitoAtencion;
					});

					ContratosInternosDataService.TipoRetencionObtenerTodos().then(function(tiposRetencion){
						vm.filter.tiposRetencion = tiposRetencion;
						vm.filter.IdTipoRetencionElegida = vm.data.participacionEdit.IdTipoRetencionContratoInterno !== 0 ? vm.data.participacionEdit.IdTipoRetencionContratoInterno : 1;
					});

					if(vm.data.participacionEdit.IdTipoPrefacturable!==0){
						SupportDataService.ObtenerPrefacturablePorId(vm.data.participacionEdit.IdTipoPrefacturable, vm.data.participacionEdit.IdPrefacturable).then(function(prefacturable){
							vm.filter.prefacturable = prefacturable;
						})
					}
				});
			}

			function obtenerParticipacionDto(){
				var def = $q.defer();
				if(idParticipacionEdit){
					ContratosInternosDataService.ParticipacionObtenerPorId(idParticipacionEdit)
					.then(function(participacionDto){
						def.resolve(participacionDto);
					});
				}
				else{
					ContratosInternosDataService.ParticipacionObtenerNuevo()
					.then(function(participacionDto){
						def.resolve(participacionDto);
					});
				}
				return def.promise;
			}
		}
	};

	return module;
})();