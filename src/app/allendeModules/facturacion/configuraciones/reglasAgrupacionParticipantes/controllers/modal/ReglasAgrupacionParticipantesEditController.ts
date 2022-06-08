/**
 * @author:			jbasiluk
 * @description:	Reglas Agrupación de Participantes
 * @type:			Controller
 **/
import { ISupportDataService, IAmbitoDataService } from '../../../../../support/basic/services';

export default (function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('ReglasAgrupacionParticipantesEditController', ReglasAgrupacionParticipantesEditController);

		ReglasAgrupacionParticipantesEditController.$inject = ['$log', '$q', 'SupportDataService', 'SupportLogicService', 'AutorizadorDataService',
		'AmbitoDataService', 'ReglasAgrupacionParticipantesDataService', 'IdReglaEditar', '$uibModalInstance', 'ModalService'];

		function ReglasAgrupacionParticipantesEditController($log, $q, SupportDataService: ISupportDataService, SupportLogicService, AutorizadorDataService,
			AmbitoDataService: IAmbitoDataService, ReglasAgrupacionParticipantesDataService, IdReglaEditar, $uibModalInstance, ModalService)
		{
			var vm = this;

			vm.title = {
				name : '',
				icon : ''
			};

			vm.data = {
				tiposRegla: [],
				reglaEdit: {},
				mutual: {}
			};

			vm.filter = {
				IdSucursalElegida: '',
				sucursales: '',
				IdAmbitoElegido: '',
				ambitos: '',
				IdServicioElegido: '',
				servicios: '',
                prefacturable: '',                
                IdTipoAgrupacionElegido : '',
                tiposAgrupacion: '',
				tipoAgrupacion: '',
				codigoMutual: '',
				nombreMutual: ''
			};

			vm.formControl = {
				cancel : cancel,
				guardar : guardar,
				/*MUTUAL*/
				buscarMutuales: buscarMutuales,
				buscarMutual: buscarMutual,
				buscarMutualEnter: buscarMutualEnter
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
				vm.data.reglaEdit.IdTipoAgrupacion = vm.filter.IdTipoAgrupacionElegido ? vm.filter.IdTipoAgrupacionElegido : 0;
				if (vm.data.mutual != null)
					vm.data.reglaEdit.IdMutual = vm.data.mutual.Id;
				else
					vm.data.reglaEdit.IdMutual = 0;

				ReglasAgrupacionParticipantesDataService.ReglaGuardar(vm.data.reglaEdit)
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

			/* BUSCADOR MUTUALES */

			function buscarMutuales() {
				SupportDataService.entidadesBuscador = AutorizadorDataService.getAllMutualConAutorizadorNoHijas();
				SupportDataService.tituloBuscador = 'Seleccionar Mutual';
				SupportDataService.mostrarIdBuscador = false;
				SupportDataService.mostrarCodigoBuscador = true;
				SupportDataService.mostrarNombreBuscador = true;
				SupportDataService.mostrarDescripcionBuscador = false;
				SupportDataService.tituloIdBuscador = '';
				SupportDataService.tituloCodigoBuscador = 'Codigo';
				SupportDataService.tituloNombreBuscador = 'Mutual';
				SupportDataService.tituloDescripcionBuscador = '';
				SupportLogicService.openSelectorBase()
					.then(function (result) {
						vm.filter.codigoMutual = result.Codigo;
						vm.filter.nombreMutual = result.Nombre;
						vm.data.mutual = result;
					})
					.catch(function (pError) {
						limpiarFiltroMutuales();
						return;
					});
			};

			function buscarMutual() {
				if (vm.filter.codigoMutual != null && vm.filter.codigoMutual != '') {
					AutorizadorDataService.getMutualByCodigo(vm.filter.codigoMutual)
						.then(function (result) {
							if (result == null) {
								limpiarFiltroMutuales();
							}
							else {
								vm.filter.codigoMutual = result.Codigo;
								vm.filter.nombreMutual = result.Nombre;
								vm.data.mutual = result;
							}
						})
						.catch(function (pError) {
							ModalService.error(pError.message);
							limpiarFiltroMutuales();
						});
				}
				else {
					limpiarFiltroMutuales();
				}
			}

			function buscarMutualEnter(keyEvent) {
				if (keyEvent.which === 13)
					buscarMutual();
			}

			function limpiarFiltroMutuales() {
				vm.filter.codigoMutual = '';
				vm.filter.nombreMutual = '';
				vm.data.mutual = null;
			}

			/* ---------------------------------------- ACTIVATE ---------------------------------------- */

			activate();

			function activate () {
				vm.title.icon = IdReglaEditar === 0 ? 'NEW2' : 'EDIT';
				vm.title.name = IdReglaEditar === 0 ? 'Nueva Regla de Agrupación de Participantes' : 'Editar Regla de Agrupación de Participantes';

				obtenerReglaDto().then(function(reglaEdit){
					vm.data.reglaEdit = reglaEdit;

					
					ReglasAgrupacionParticipantesDataService.SucursalObtenerTodos().then(function(sucursales){
						vm.filter.sucursales = sucursales;
						if(vm.data.reglaEdit.IdSucursal !== 0) vm.filter.IdSucursalElegida = vm.data.reglaEdit.IdSucursal;
					});

					AmbitoDataService.getAll().then(function(ambitos){
						vm.filter.ambitos = ambitos;
						if(vm.data.reglaEdit.IdAmbitoAtencion !== 0) vm.filter.IdAmbitoElegido = vm.data.reglaEdit.IdAmbitoAtencion;
					});

					ReglasAgrupacionParticipantesDataService.ServicioObtenerTodos().then(function(servicio){
						vm.filter.servicios = servicio;
						if(vm.data.reglaEdit.IdServicio !== 0) vm.filter.IdServicioElegido = vm.data.reglaEdit.IdServicio;
					});

					if(vm.data.reglaEdit.IdPrefacturable){
						SupportDataService.ObtenerPrefacturablePorId(vm.data.reglaEdit.IdTipoPrefacturable, vm.data.reglaEdit.IdPrefacturable)
							.then(function(prefacturable){
								vm.filter.prefacturable = prefacturable;
							})
					}

                    ReglasAgrupacionParticipantesDataService.TipoAgrupacionSeleccionObtenerTodos().then(function(tipos){
						vm.filter.tiposAgrupacion = tipos;
						if(vm.data.reglaEdit.IdTipoAgrupacion !== 0) vm.filter.IdTipoAgrupacionElegido = vm.data.reglaEdit.IdTipoAgrupacion;
					});

					if (reglaEdit.CodigoMutual > 0) {
						//mutual
						vm.filter.codigoMutual = reglaEdit.CodigoMutual;
						buscarMutual();
					}

				});
			}

			function obtenerReglaDto(){
				var def = $q.defer();
				if(IdReglaEditar){
					ReglasAgrupacionParticipantesDataService.ReglaObtenerPorId(IdReglaEditar)
					.then(function(reglaDto){
						def.resolve(reglaDto);
					});
				}
				else{
					ReglasAgrupacionParticipantesDataService.ReglaObtenerNuevo()
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