/**
 * @author:			Rodrigo Bassi
 * @description:	Factyura Directo Edit
 * @type:			Controller
 **/
import { ISupportDataService, IAmbitoDataService } from '../../../../support/basic/services';

export default (function () {
	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.controller('facturaDirectoEditController', facturaDirectoEditController);

		facturaDirectoEditController.$inject = [
			'Logger', '$state', 'ModalService', 'ContratosInternosDataService', '$scope', '$uibModalInstance', 'idFacturaDirectoEdit',
			'$q', '$stateParams', 'SupportDataService', 'AmbitoDataService', 'idContratoEdit', 'AlertaService'];

		function facturaDirectoEditController(
			$log, $state, ModalService, ContratosInternosDataService, $scope, $uibModalInstance, idFacturaDirectoEdit,
			$q, $stateParams, SupportDataService: ISupportDataService, AmbitoDataService: IAmbitoDataService, idContratoEdit, AlertaService: IAlertaService) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('facturaDirectoEditController');
			/* ----------------------------------------- API Y VARIABLESES ----------------------------------------- */

			var vm = this;

			vm.title = {
				name: '',
				icon: ''
			};

			vm.data = {
				facturaDirectoEdit: ''
			};

			vm.filter = {
				IdSucursalElegida: '',
				sucursales: '',
				IdAmbitoElegido: '',
				ambitos: '',
				IdServicioElegido: '',
				servicios: '',
				IdTipoRetencionElegida: '',
				tiposRetencion: '',
				profesional: '',
				prefacturable: '',
				matricula: null,
				idTipoContratable: null,
				mutualElegida: null,
				CodigoFinanciador: null,
				facturaDirectoTilde: false
			};

			vm.formControl = {
				cancel: cancel,
				guardar: guardar
			};

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			function cancel() {
				$uibModalInstance.dismiss('close');
			}

			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */

			function guardar() {
				if(!vm.filter.mutualElegida) return AlertaService.NewWarning("Debe elegir una Mutual.");

				vm.data.facturaDirectoEdit.IdSucursal = vm.filter.IdSucursalElegida ? vm.filter.IdSucursalElegida : 0;
				vm.data.facturaDirectoEdit.IdAmbitoAtencion = vm.filter.IdAmbitoElegido ? vm.filter.IdAmbitoElegido : 0;
				vm.data.facturaDirectoEdit.IdFinanciador = vm.filter.mutualElegida.Id ? vm.filter.mutualElegida.Id : 0;
				vm.data.facturaDirectoEdit.FacturaDirecto = vm.filter.facturaDirectoTilde;
				vm.data.facturaDirectoEdit.IdContratoInterno = idContratoEdit;

				ContratosInternosDataService.FacturaDirectoGuardar(vm.data.facturaDirectoEdit)
					.then(function (result) {
						if (result.IsOk === false) {
							ModalService.warning("Verifique por favor. " + result.Message);
						}
						else {
							$uibModalInstance.close(result);
							ModalService.success("Se ha guardado la Configuracion.");
						}
					});
			}

			activate();

			function activate() {
				vm.title.icon = idFacturaDirectoEdit === null ? 'NEW2' : 'EDIT';
				vm.title.name = idFacturaDirectoEdit === null ? 'Nueva Facturación Directa' : 'Editar Facturación Directa';

				vm.filter.matricula = $stateParams.matricula;
				vm.filter.idTipoContratable = $stateParams.idTipoContratable;

				obtenerFacturaDirectoDto().then(function (facturaDirectoEdit) {
					vm.data.facturaDirectoEdit = facturaDirectoEdit;

					vm.filter.facturaDirectoTilde = vm.data.facturaDirectoEdit.FacturaDirecto
					vm.filter.CodigoFinanciador = vm.data.facturaDirectoEdit.CodigoFinanciador;
					ContratosInternosDataService.SucursalObtenerTodos().then(function (sucursales) {
						vm.filter.sucursales = sucursales;
						if (vm.data.facturaDirectoEdit.IdSucursal !== 0) vm.filter.IdSucursalElegida = vm.data.facturaDirectoEdit.IdSucursal;
					});

					AmbitoDataService.getAll().then(function (ambitos) {
						vm.filter.ambitos = ambitos;
						if (vm.data.facturaDirectoEdit.IdAmbitoAtencion !== 0) vm.filter.IdAmbitoElegido = vm.data.facturaDirectoEdit.IdAmbitoAtencion;
					});
				});
			}

			function obtenerFacturaDirectoDto() {
				var def = $q.defer();
				if (idFacturaDirectoEdit) {
					ContratosInternosDataService.FacturaDirectoObtenerPorId(idFacturaDirectoEdit)
						.then(function (facturaDirectoDto) {
							def.resolve(facturaDirectoDto);
						});
				}
				else {
					ContratosInternosDataService.FacturaDirectoObtenerNuevo()
						.then(function (facturaDirectoDto) {
							def.resolve(facturaDirectoDto);
						});
				}
				return def.promise;
			}
		}
	};

	return module;
})();