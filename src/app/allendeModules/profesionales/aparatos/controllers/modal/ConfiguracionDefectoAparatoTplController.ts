/**
 * @author:			Pedro Ferrer
 * @description:	Configuracion Por Defecto
 * @type:			Controller
 **/
import { ISupportDataService, IAmbitoDataService } from '../../../../support/basic/services';

export default (function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('ConfiguracionDefectoAparatoTplController', ConfiguracionDefectoAparatoTplController);

		ConfiguracionDefectoAparatoTplController.$inject = ['Logger', '$state', 'ModalService', 'AparatosDataService', '$scope', '$uibModalInstance', 
			'idConfiguracionEdit', 'matriculaProfesional', '$q', '$stateParams', 'ProfesionalesDataService', 'DateUtils','idAparato', 'SupportDataService',
			'idTipoAparato', 'AmbitoDataService'];

		function ConfiguracionDefectoAparatoTplController ($log, $state, ModalService, AparatosDataService, $scope, $uibModalInstance, 
			idConfiguracionEdit, matriculaProfesional, $q, $stateParams, ProfesionalesDataService, DateUtils, idAparato, SupportDataService: ISupportDataService,
			idTipoAparato, AmbitoDataService : IAmbitoDataService) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('ConfiguracionDefectoAparatoTplController');
			/* ----------------------------------------- API Y VARIABLESES ----------------------------------------- */

			var vm = this;
			vm.today = new Date();
			
			vm.title = {
				name : '',
				icon : ''
			};

			vm.data = {
				configuracionEdit : ''
			};

			vm.filter = {
				IdSucursalElegida : '',
				sucursales : '',
				IdAmbitoElegido : '',
				ambitos : '',
				IdServicioElegido : '',
				servicios : '',
				IdDiaSemanaElegido : '',
				dias : '',
				IdTipoDeSemanaElegido : '',
				tipoSemana : '',
				IdTipoDeDiaElegido : '',
				tipoDia : '',
				profesional : '',
				prefacturable : '',
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
				vm.data.configuracionEdit.IdSucursal = vm.filter.IdSucursalElegida ? vm.filter.IdSucursalElegida : 0;
				vm.data.configuracionEdit.IdAmbitoAtencion = vm.filter.IdAmbitoElegido ? vm.filter.IdAmbitoElegido : 0;
				vm.data.configuracionEdit.IdServicio = vm.filter.IdServicioElegido ? vm.filter.IdServicioElegido : 0;
				vm.data.configuracionEdit.IdDiaSemana = vm.filter.IdDiaSemanaElegido ? vm.filter.IdDiaSemanaElegido : 0;
				vm.data.configuracionEdit.IdTipoDeSemana = vm.filter.IdTipoDeSemanaElegido ? vm.filter.IdTipoDeSemanaElegido : 0;
				vm.data.configuracionEdit.IdTipoDeDia = vm.filter.IdTipoDeDiaElegido ? vm.filter.IdTipoDeDiaElegido : 0;
				vm.data.configuracionEdit.IdProfesional = vm.filter.profesional.Id;
				vm.data.configuracionEdit.IdRecurso = idAparato;
				vm.data.configuracionEdit.IdTipoRecurso = idTipoAparato;
				vm.data.configuracionEdit.IdTipoPrefacturable = (vm.filter.prefacturable) ? vm.filter.prefacturable.IdTipo : 0;
				vm.data.configuracionEdit.IdPrefacturable = (vm.filter.prefacturable) ? vm.filter.prefacturable.Id : 0;
				vm.data.configuracionEdit.TienePeriodo = vm.filter.TienePeriodo;
				vm.data.configuracionEdit.Desde = DateUtils.parseToBe(vm.filter.Desde);
				vm.data.configuracionEdit.Hasta = DateUtils.parseToBe(vm.filter.Hasta);

				AparatosDataService.ConfiguracionGuardar(vm.data.configuracionEdit)
				.then(function(result){
					if (result.IsOk === false) {
						ModalService.warning("Verifique por favor. " + result.Message);
					}
					else {
						$uibModalInstance.close(result);
						ModalService.success("Se ha guardado la configuración.");
					}
				});
			}
			
			function cancel() {
				$uibModalInstance.dismiss('close');
			}

			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */

			activate();

			function activate () {

				vm.title.icon = idConfiguracionEdit === null ? 'NEW2' : 'EDIT';
				vm.title.name = idConfiguracionEdit === null ? 'Nueva Configuración por Defecto' : 'Editar Configuración por Defecto';

				obtenerConfiguracionDto().then(function(configuracionEdit){
					vm.data.configuracionEdit = configuracionEdit;

					vm.filter.TienePeriodo = vm.data.configuracionEdit.TienePeriodo;
					vm.filter.Desde = DateUtils.parseToFe(vm.data.configuracionEdit.Desde);
					vm.filter.Hasta = DateUtils.parseToFe(vm.data.configuracionEdit.Hasta);

					AparatosDataService.SucursalObtenerTodos().then(function(sucursales){
						vm.filter.sucursales = sucursales;
						if(vm.data.configuracionEdit.IdSucursal !== 0) vm.filter.IdSucursalElegida = vm.data.configuracionEdit.IdSucursal;
					});

					AmbitoDataService.getAll().then(function(ambitos){
						vm.filter.ambitos = ambitos;
						if(vm.data.configuracionEdit.IdAmbitoAtencion !== 0) vm.filter.IdAmbitoElegido = vm.data.configuracionEdit.IdAmbitoAtencion;
					});

					AparatosDataService.ServicioObtenerTodos().then(function(servicio){
						vm.filter.servicios = servicio;
						if(vm.data.configuracionEdit.IdServicio !== 0) vm.filter.IdServicioElegido = vm.data.configuracionEdit.IdServicio;
					});

					AparatosDataService.DiaSemanaObtenerTodos().then(function(dias){
						vm.filter.dias = dias;
						if(vm.data.configuracionEdit.IdDiaSemana !== 0) vm.filter.IdDiaSemanaElegido = vm.data.configuracionEdit.IdDiaSemana;
					});

					AparatosDataService.TipoDeSemanaObtenerTodos().then(function(tipoSemana){
						vm.filter.tipoSemana = tipoSemana;
						vm.filter.tipoDia = tipoSemana;
						if(vm.data.configuracionEdit.IdTipoDeSemana !== 0) vm.filter.IdTipoDeSemanaElegido = vm.data.configuracionEdit.IdTipoDeSemana;
						if(vm.data.configuracionEdit.IdTipoDeDia !== 0) vm.filter.IdTipoDeDiaElegido = vm.data.configuracionEdit.IdTipoDeDia;
					});

					if(vm.data.configuracionEdit.IdTipoPrefacturable !== 0 ){
						SupportDataService.ObtenerPrefacturablePorId(vm.data.configuracionEdit.IdTipoPrefacturable, vm.data.configuracionEdit.IdPrefacturable).then(function(prefacturable){
							vm.filter.prefacturable = prefacturable;
						})
					}

					if(matriculaProfesional){
						ProfesionalesDataService.ProfesionalObtenerPorMatricula(matriculaProfesional).then(function(profesional){
							vm.filter.profesional = profesional;
						})
					}
				});
			}

			function obtenerConfiguracionDto(){
				var def = $q.defer();
				if(idConfiguracionEdit){
					AparatosDataService.ConfiguracionObtenerPorId(idConfiguracionEdit)
					.then(function(configuracionDto){
						def.resolve(configuracionDto);
					});
				}
				else{
					AparatosDataService.ConfiguracionObtenerNuevo()
					.then(function(configuracionDto){
						def.resolve(configuracionDto);
					});
				}
				return def.promise;
			}
		}
	};

	return module;
})();