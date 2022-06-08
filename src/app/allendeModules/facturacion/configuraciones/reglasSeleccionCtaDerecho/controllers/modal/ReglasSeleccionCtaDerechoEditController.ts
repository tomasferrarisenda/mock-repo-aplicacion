/**
 * @author:			jbasiluk
 * @description:	Reglas Selección Cta Derecho
 * @type:			Controller
 **/
import { ISupportDataService, IAmbitoDataService } from '../../../../../support/basic/services';

export default (function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('ReglasSeleccionCtaDerechoEditController', ReglasSeleccionCtaDerechoEditController);

		ReglasSeleccionCtaDerechoEditController.$inject = ['$log', '$q', 'SupportDataService',
		'AmbitoDataService', 'ReglasSeleccionCtaDerechoDataService', 'IdReglaEditar', '$uibModalInstance', 'ModalService'];

		function ReglasSeleccionCtaDerechoEditController($log, $q, SupportDataService: ISupportDataService,
			AmbitoDataService: IAmbitoDataService, ReglasSeleccionCtaDerechoDataService, IdReglaEditar, $uibModalInstance, ModalService)
		{
			var vm = this;

			vm.title = {
				name : '',
				icon : ''
			};

			vm.data = {
				tiposRegla: [],
				reglaEdit: {}
			};

			vm.filter = {
				IdSucursalElegida: '',
				sucursales: '',
				IdAmbitoElegido: '',
				ambitos: '',
				IdServicioElegido: '',
				servicios: '',
                prefacturable: '',                
                IdTipoReglaElegido : '',
                tiposRegla: '',
				tipoRegla: ''
			};

			vm.formControl = {
				cancel : cancel,
				guardar : guardar
			};

			/* ---------------------------------------- IMPLEMENTACIÓN ---------------------------------------- */

			function cancel(){
				$uibModalInstance.dismiss('cancel');
			}

			function guardar() {
				vm.data.reglaEdit.IdSucursal = vm.filter.IdSucursalElegida ? vm.filter.IdSucursalElegida : 0;
				vm.data.reglaEdit.IdAmbitoAtencion = vm.filter.IdAmbitoElegido ? vm.filter.IdAmbitoElegido : 0;
				vm.data.reglaEdit.IdServicio = vm.filter.IdServicioElegido ? vm.filter.IdServicioElegido : 0;
				vm.data.reglaEdit.IdTipoPrefacturable = vm.filter.prefacturable ? vm.filter.prefacturable.IdTipo : 0;
				vm.data.reglaEdit.IdPrefacturable = vm.filter.prefacturable ? vm.filter.prefacturable.Id : 0;
				vm.data.reglaEdit.IdTipoRegla = vm.filter.IdTipoReglaElegido ? vm.filter.IdTipoReglaElegido : 0;

				ReglasSeleccionCtaDerechoDataService.ReglaGuardar(vm.data.reglaEdit)
					.then(function (result) {
						if (result.IsOk) {
							$uibModalInstance.close(result);
							ModalService.success("Se ha guardado la configuración.");
						}
						else {
							ModalService.warning("Verifique por favor. " + result.Message);
						}
					});
			}

			/* ---------------------------------------- ACTIVATE ---------------------------------------- */

			activate();

			function activate () {
				vm.title.icon = IdReglaEditar === 0 ? 'NEW2' : 'EDIT';
				vm.title.name = IdReglaEditar === 0 ? 'Nueva Regla Selección Cta Derecho' : 'Editar Regla Selección Cta Derecho';

				obtenerReglaDto().then(function(reglaEdit){
					vm.data.reglaEdit = reglaEdit;

					
					ReglasSeleccionCtaDerechoDataService.SucursalObtenerTodos().then(function(sucursales){
						vm.filter.sucursales = sucursales;
						if(vm.data.reglaEdit.IdSucursal !== 0) vm.filter.IdSucursalElegida = vm.data.reglaEdit.IdSucursal;
					});

					AmbitoDataService.getAll().then(function(ambitos){
						vm.filter.ambitos = ambitos;
						if(vm.data.reglaEdit.IdAmbitoAtencion !== 0) vm.filter.IdAmbitoElegido = vm.data.reglaEdit.IdAmbitoAtencion;
					});

					ReglasSeleccionCtaDerechoDataService.ServicioObtenerTodos().then(function(servicio){
						vm.filter.servicios = servicio;
						if(vm.data.reglaEdit.IdServicio !== 0) vm.filter.IdServicioElegido = vm.data.reglaEdit.IdServicio;
					});

					if(vm.data.reglaEdit.IdPrefacturable){
						SupportDataService.ObtenerPrefacturablePorId(vm.data.reglaEdit.IdTipoPrefacturable, vm.data.reglaEdit.IdPrefacturable)
							.then(function(prefacturable){
								vm.filter.prefacturable = prefacturable;
							})
					}

                    ReglasSeleccionCtaDerechoDataService.TipoReglaSeleccionObtenerTodos().then(function(tipos){
						vm.filter.tiposRegla = tipos;
						if(vm.data.reglaEdit.IdTipoRegla !== 0) vm.filter.IdTipoReglaElegido = vm.data.reglaEdit.IdTipoRegla;
					});

				});
			}

			function obtenerReglaDto(){
				var def = $q.defer();
				if(IdReglaEditar){
					ReglasSeleccionCtaDerechoDataService.ReglaObtenerPorId(IdReglaEditar)
					.then(function(reglaDto){
						def.resolve(reglaDto);
					});
				}
				else{
					ReglasSeleccionCtaDerechoDataService.ReglaObtenerNuevo()
					.then(function(reglaDto){
						def.resolve(reglaDto);
					});
				}
				return def.promise;
			}
		}
	};
	return module;
})();