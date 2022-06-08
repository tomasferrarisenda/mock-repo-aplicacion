/**
 * @author:			drobledo
 * @description:	Cuentas Por Defecto Derechos
 * @type:			Controller
 **/
import { ISupportDataService, IAmbitoDataService } from '../../../../../support/basic/services';

export default (function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('CuentasDefectoDerechosEditController', CuentasDefectoDerechosEditController);

		CuentasDefectoDerechosEditController.$inject = ['$log', '$q', 'SupportDataService',
		'AmbitoDataService',
		 'CuentasDefectoDerechosDataService', 'IdCuentaEditar', '$uibModalInstance', 'ModalService', 'numeroCuenta', 'ContratableDataService'];

		function CuentasDefectoDerechosEditController($log, $q, SupportDataService: ISupportDataService,
			AmbitoDataService: IAmbitoDataService,
		 	CuentasDefectoDerechosDataService, IdCuentaEditar, $uibModalInstance, ModalService, numeroCuenta, ContratableDataService)
		{
			var vm = this;

			vm.title = {
				name : '',
				icon : ''
			};

			vm.data = {
				cuentasDefectoDerechos: [],
				cuentaEdit: {}
			};

			vm.filter = {
				nombre : '',
				cuentaFiltro : '',
				contratableElegido : '',
				IdSucursalElegida: '',
				sucursales: '',
				IdAmbitoElegido: '',
				ambitos: '',
				IdServicioElegido: '',
				servicios: '',
				prefacturable: '',
				matricula: '',
				idTipoContratable: 0,
				cuenta: ''
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
				vm.data.cuentaEdit.IdTipoEntidadContratoInterno = vm.filter.contratableElegido.IdTipoEntidadContratoInterno 
					?vm.filter.contratableElegido.IdTipoEntidadContratoInterno : 0;
				vm.data.cuentaEdit.IdEntidad = vm.filter.contratableElegido.Id ? vm.filter.contratableElegido.Id : 0;
				vm.data.cuentaEdit.IdSucursal = vm.filter.IdSucursalElegida ? vm.filter.IdSucursalElegida : 0;
				vm.data.cuentaEdit.IdAmbitoAtencion = vm.filter.IdAmbitoElegido ? vm.filter.IdAmbitoElegido : 0;
				vm.data.cuentaEdit.IdServicio = vm.filter.IdServicioElegido ? vm.filter.IdServicioElegido : 0;
				vm.data.cuentaEdit.IdTipoPrefacturable = vm.filter.prefacturable ? vm.filter.prefacturable.IdTipo : 0;
				vm.data.cuentaEdit.IdPrefacturable = vm.filter.prefacturable ? vm.filter.prefacturable.Id : 0;
				vm.data.cuentaEdit.IdCuenta = vm.filter.cuenta.Id;

				CuentasDefectoDerechosDataService.CuentaGuardar(vm.data.cuentaEdit)
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
				vm.title.icon = IdCuentaEditar === 0 ? 'NEW2' : 'EDIT';
				vm.title.name = IdCuentaEditar === 0 ? 'Nueva Cuenta por Defecto para Derechos' : 'Editar Cuenta por Defecto para Derechos';

				obtenerCuentaDto().then(function(cuentaEdit){
					vm.data.cuentaEdit = cuentaEdit;

					if (vm.data.cuentaEdit.IdEntidad) {
						ContratableDataService.ObtenerPorTipoEId(vm.data.cuentaEdit.IdTipoEntidadContratoInterno, vm.data.cuentaEdit.IdEntidad)
						.then(function(contratable){
							if(contratable){
								vm.filter.matricula = contratable.NumeroMatricula;
								vm.filter.idTipoContratable = contratable.IdTipoEntidadContratoInterno;
							}
						});
					}
					
					CuentasDefectoDerechosDataService.SucursalObtenerTodos().then(function(sucursales){
						vm.filter.sucursales = sucursales;
						if(vm.data.cuentaEdit.IdSucursal !== 0) vm.filter.IdSucursalElegida = vm.data.cuentaEdit.IdSucursal;
					});

					AmbitoDataService.getAll().then(function(ambitos){
						vm.filter.ambitos = ambitos;
						if(vm.data.cuentaEdit.IdAmbitoAtencion !== 0) vm.filter.IdAmbitoElegido = vm.data.cuentaEdit.IdAmbitoAtencion;
					});

					CuentasDefectoDerechosDataService.ServicioObtenerTodos().then(function(servicio){
						vm.filter.servicios = servicio;
						if(vm.data.cuentaEdit.IdServicio !== 0) vm.filter.IdServicioElegido = vm.data.cuentaEdit.IdServicio;
					});

					if(vm.data.cuentaEdit.IdPrefacturable){
						SupportDataService.ObtenerPrefacturablePorId(vm.data.cuentaEdit.IdTipoPrefacturable, vm.data.cuentaEdit.IdPrefacturable)
							.then(function(prefacturable){
								vm.filter.prefacturable = prefacturable;
							})
					}

					if(vm.data.cuentaEdit.IdCuenta){
						ContratableDataService.CuentaObtenerPorId(vm.data.cuentaEdit.IdCuenta).then(function(cuenta){
							vm.filter.cuenta = cuenta;
						})
					}
				});
			}

			// TODO: Llevar lógica a servicio. @drobledo
			function obtenerCuentaDto(){
				var def = $q.defer();
				if(IdCuentaEditar){
					CuentasDefectoDerechosDataService.CuentaObtenerPorId(IdCuentaEditar)
					.then(function(cuentaDto){
						def.resolve(cuentaDto);
					});
				}
				else{
					CuentasDefectoDerechosDataService.CuentaObtenerNuevo()
					.then(function(cuentaDto){
						def.resolve(cuentaDto);
					});
				}
				return def.promise;
			}
		}
	};
	return module;
})();