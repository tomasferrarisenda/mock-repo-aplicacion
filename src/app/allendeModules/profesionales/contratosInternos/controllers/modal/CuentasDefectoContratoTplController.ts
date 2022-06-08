/**
 * @author:			Pedro Ferrer
 * @description:	Cuentas Por Defecto
 * @type:			Controller
 **/
import { ISupportDataService, IAmbitoDataService } from '../../../../support/basic/services';
import { ICuentaDataService } from '../../../../facturacion/configuraciones/cuentas/services'

export default (function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('CuentasDefectoContratoTplController', CuentasDefectoContratoTplController);

		CuentasDefectoContratoTplController.$inject = ['Logger', '$state', 'ModalService', 'ContratosInternosDataService', '$scope', '$uibModalInstance', 'DateUtils',
		'idCuentaEdit', 'numeroCuenta', 'ContratableElegido', '$q', '$stateParams', 'ContratableDataService', 'idContratoEdit', 'SupportDataService', 'AmbitoDataService', 'CuentaDataService'];

		function CuentasDefectoContratoTplController ($log, $state, ModalService, ContratosInternosDataService, $scope, $uibModalInstance, DateUtils, idCuentaEdit, 
			numeroCuenta, ContratableElegido, $q, $stateParams, ContratableDataService, idContratoEdit, SupportDataService: ISupportDataService, AmbitoDataService : IAmbitoDataService,
			CuentaDataService : ICuentaDataService) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('CuentasDefectoContratoTplController');
			/* ----------------------------------------- API Y VARIABLESES ----------------------------------------- */

			var vm = this;
			vm.today = new Date();
			
			vm.title = {
				name : '',
				icon : ''
			};

			vm.data = {
				cuentaEdit : ''
			};

			vm.filter = {
				IdSucursalElegida : '',
				sucursales : '',
				IdAmbitoElegido : '',
				ambitos : '',
				IdServicioElegido : '',
				servicios : '',
				Recurso: '',
				IdDiaSemanaElegido : '',
				IdTipoDiaDelMesElegido : '',
				tiposCodigoNomenclador: '',
				IdTipoCodigoNomenclador : '',
				dias : '',
				profesional : '',
				prefacturable : '',
				tiposDiaDelMes : '',
				TienePeriodo: false,
				Desde: '',
				Hasta: ''
			};

			vm.formControl = {
				cancel : cancel,
				guardar : guardar
			};

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			/* FORMULARIO */
			function guardar(isValid) {
				vm.data.cuentaEdit.IdSucursal = vm.filter.IdSucursalElegida ? vm.filter.IdSucursalElegida : 0;
				vm.data.cuentaEdit.IdAmbitoAtencion = vm.filter.IdAmbitoElegido ? vm.filter.IdAmbitoElegido : 0;
				vm.data.cuentaEdit.IdServicio = vm.filter.IdServicioElegido ? vm.filter.IdServicioElegido : 0;
				vm.data.cuentaEdit.IdTipoRecursoAtiende = vm.filter.Recurso != null? vm.filter.Recurso.IdTipoRecurso : 0;
        		vm.data.cuentaEdit.IdRecursoAtiende = vm.filter.Recurso != null? vm.filter.Recurso.Id : 0;
				vm.data.cuentaEdit.IdDiaSemana = vm.filter.IdDiaSemanaElegido ? vm.filter.IdDiaSemanaElegido : 0;
				vm.data.cuentaEdit.IdTipoDiaDelMes = vm.filter.IdTipoDiaDelMesElegido ? vm.filter.IdTipoDiaDelMesElegido : 0;
				vm.data.cuentaEdit.IdTipoCodigoNomenclador = vm.filter.IdTipoCodigoNomencladorElegido ? vm.filter.IdTipoCodigoNomencladorElegido : 0;
				vm.data.cuentaEdit.IdCuenta = vm.filter.profesional.Id;
				vm.data.cuentaEdit.IdContratoInterno = idContratoEdit;
				vm.data.cuentaEdit.IdTipoPrefacturable = (vm.filter.prefacturable) ? vm.filter.prefacturable.IdTipo : 0;
				vm.data.cuentaEdit.IdPrefacturable = (vm.filter.prefacturable) ? vm.filter.prefacturable.Id : 0;
				vm.data.cuentaEdit.TienePeriodo = vm.filter.TienePeriodo;
				vm.data.cuentaEdit.Desde = DateUtils.parseToBe(vm.filter.Desde);
				vm.data.cuentaEdit.Hasta = DateUtils.parseToBe(vm.filter.Hasta);
			
				ContratosInternosDataService.CuentaGuardar(vm.data.cuentaEdit)
				.then(function(result){
					if (result.IsOk === false) {
						ModalService.warning("Verifique por favor. " + result.Message);
					}
					else {
						$uibModalInstance.close(result);
						ModalService.success("Se ha guardado la cuenta.");
					}
				});
			}
			
			function cancel() {
				$uibModalInstance.dismiss('close');
			}

			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */

			activate();

			function activate () {

				vm.title.icon = idCuentaEdit === null ? 'NEW2' : 'EDIT';
				vm.title.name = idCuentaEdit === null ? 'Nueva Cuenta por Defecto' : 'Editar Cuenta por Defecto';

				if(ContratableElegido){
					// tengo un contratable, muestro datos en el titulo
					vm.title.name = vm.title.name + ' - ' + ContratableElegido.Nombre + " - Matricula: " + ContratableElegido.NumeroMatricula;
				}

				obtenerCuentaDto().then(function(cuentaEdit){
					vm.data.cuentaEdit = cuentaEdit;

					vm.filter.TienePeriodo = vm.data.cuentaEdit.TienePeriodo;
					vm.filter.Desde = DateUtils.parseToFe(vm.data.cuentaEdit.Desde);
					vm.filter.Hasta = DateUtils.parseToFe(vm.data.cuentaEdit.Hasta);

					ContratosInternosDataService.SucursalObtenerTodos().then(function(sucursales){
						vm.filter.sucursales = sucursales;
						if(vm.data.cuentaEdit.IdSucursal !== 0) vm.filter.IdSucursalElegida = vm.data.cuentaEdit.IdSucursal;
					});

					AmbitoDataService.getAll().then(function(ambitos){
						vm.filter.ambitos = ambitos;
						if(vm.data.cuentaEdit.IdAmbitoAtencion !== 0) vm.filter.IdAmbitoElegido = vm.data.cuentaEdit.IdAmbitoAtencion;
					});

					ContratosInternosDataService.ServicioObtenerTodos().then(function(servicio){
						vm.filter.servicios = servicio;
						if(vm.data.cuentaEdit.IdServicio !== 0) vm.filter.IdServicioElegido = vm.data.cuentaEdit.IdServicio;
					});

					if(vm.data.cuentaEdit.RecursoAtiende != null) vm.filter.Recurso = vm.data.cuentaEdit.RecursoAtiende;

					ContratosInternosDataService.DiaSemanaObtenerTodos().then(function(dias){
						vm.filter.dias = dias;
						if(vm.data.cuentaEdit.IdDiaSemana !== 0) vm.filter.IdDiaSemanaElegido = vm.data.cuentaEdit.IdDiaSemana;
					});

					ContratosInternosDataService.TipoCodigoNomencladorObtenerTodos().then(function(tipos){
						vm.filter.tiposCodigoNomenclador = tipos;
						if(vm.data.cuentaEdit.IdTipoCodigoNomenclador !== 0) vm.filter.IdTipoCodigoNomencladorElegido = vm.data.cuentaEdit.IdTipoCodigoNomenclador;
					});

					vm.filter.tiposDiaDelMes = [ {Id:1, Nombre:'IMPAR'}, {Id:2, Nombre:'PAR'}]
					if(vm.data.cuentaEdit.IdTipoDiaDelMes !== 0) vm.filter.IdTipoDiaDelMesElegido = vm.data.cuentaEdit.IdTipoDiaDelMes;

					if(vm.data.cuentaEdit.IdTipoPrefacturable!==0){
						SupportDataService.ObtenerPrefacturablePorId(vm.data.cuentaEdit.IdTipoPrefacturable, vm.data.cuentaEdit.IdPrefacturable).then(function(prefacturable){
							vm.filter.prefacturable = prefacturable;
						})
					}

					if(numeroCuenta){
						CuentaDataService.obtenerPorCodigo(numeroCuenta).then(function(profesional){
							vm.filter.profesional = profesional;
						})
					}
				});
			}

			function obtenerCuentaDto(){
				var def = $q.defer();
				if(idCuentaEdit){
					ContratosInternosDataService.CuentaObtenerPorId(idCuentaEdit)
					.then(function(cuentaDto){
						def.resolve(cuentaDto);
					});
				}
				else{
					ContratosInternosDataService.CuentaObtenerNuevo()
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