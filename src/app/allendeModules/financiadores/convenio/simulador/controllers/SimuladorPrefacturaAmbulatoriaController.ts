/**
 * @author:			jbasiluk
 * @description:	Simulador de Prefactura Ambulatoria
 * @type:			Controller
 **/

import * as angular from 'angular';

export default (function () {
	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.controller('SimuladorPrefacturaAmbulatoriaController', SimuladorPrefacturaAmbulatoriaController);

		SimuladorPrefacturaAmbulatoriaController.$inject = ['$sce', 'Logger', '$state', 'ModalService',
			'SupportLogicService', 'FinanciadorLogicService', '$q', 
			'ICON_LIST', 'SimuladorDataService', 'ConvenioDataService', 'DateUtils'];

		function SimuladorPrefacturaAmbulatoriaController($sce, $log, $state, ModalService,
			SupportLogicService, FinanciadorLogicService, $q, 
			ICON_LIST, SimuladorDataService, ConvenioDataService, DateUtils) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('SimuladorPrefacturaAmbulatoriaController');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			var vm = this;
			vm.today = new Date();

			vm.title = {
                name: 'Simulador de Prefactura Ambulatoria',
                resultado : 'Resultado Evaluación:',
				icon: 'COGS'
			};

			vm.ICON_LIST = ICON_LIST

			vm.data = {
				sucursales: null,
				servicios: null,
                tiposAfiliado: null,
                prefactura : null				
			};

			vm.filter = {
				mutual: null,
				plan: null,
				fecha: '',
				sucursal: null,
				servicio: null,
                tipoAfiliado: null,
                filtro : {},
                idPaciente : 0,
                recurso : null,
                prestacion : null
			};

			vm.formControl = {
				loading: false,
				volver: volver,
                evaluar: evaluar,
                prefacturaValida : false,
				verItemsDetalle : verItemsDetalle,
				limpiarFiltros: limpiarFiltros,
				infoFinanciador: infoFinanciador,
			};

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			// Modal de los datos del financiador.
			function infoFinanciador() {
				if (vm.filter.mutual !== null && vm.filter.mutual !== '') {
					FinanciadorLogicService.infoFinanciador(vm.filter.mutual.Id);
				} else {
					ModalService.warning('La mutual es requerida para obtener info del financiador.');
				}
			}

            function verItemsDetalle(pCodigoPrefacturable) {			
                for (var i = vm.data.prefactura.Items.length - 1; i >= 0; i--) {
                    if (vm.data.prefactura.Items[i].CodigoPrefacturable == pCodigoPrefacturable) {
                        vm.data.prefactura.Items[i].VerDetalle = !vm.data.prefactura.Items[i].VerDetalle
                        return;
                    }
                    
                }					
            }	

			function volver() {
				$state.go('homesistemas');
			}

			function evaluar() {
				//console.log("vm.filter ",vm.filter)
				
				// if(vm.filter.idPaciente == null || vm.filter.idPaciente == 0){
                //     ModalService.warning('El paciente es requerido para la simulación.');
				// 	return;
                // }

                // if(vm.filter.recurso == null || vm.filter.recurso == ''){
                //     ModalService.warning('El recurso es requerido para la simulación.');
				// 	return;
                // }

                if(vm.filter.prestacion == null || vm.filter.prestacion == ''){
                    ModalService.warning('La prestación es requerida para la simulación.');
					return;
                }

                // if(vm.filter.sucursal == null || vm.filter.sucursal == ''){
                //     ModalService.warning('La sucursal es requerida para la simulación.');
				// 	return;
                // }

                if(vm.filter.servicio == null || vm.filter.servicio == ''){
                    ModalService.warning('El servicio es requerido para la simulación.');
					return;
                }

				if (vm.filter.mutual == null || vm.filter.mutual == '') {
					ModalService.warning('La mutual es requerida para la simulación.');
					return;
                }
                
                if (vm.filter.plan == null || vm.filter.plan == '') {
					ModalService.warning('El plan es requerido para la simulación.');
					return;
				}
				
				if (!vm.filter.fecha) {
					ModalService.warning('La fecha es requerida para la simulación.');
					return;
				}

                // if (vm.filter.tipoAfiliado == null || vm.filter.tipoAfiliado == '') {
				// 	ModalService.warning('El tipo afiliado es requerido para la simulación.');
				// 	return;
				// }

                vm.filter.filtro.Fecha = DateUtils.parseToBe(vm.filter.fecha);

                vm.filter.filtro.IdPaciente = vm.filter.idPaciente ? vm.filter.idPaciente : 0;
                vm.filter.filtro.IdRecurso = vm.filter.recurso ? vm.filter.recurso.Id: 0;
                vm.filter.filtro.IdTipoRecurso = vm.filter.recurso ? vm.filter.recurso.IdTipoRecurso : 0;
                vm.filter.filtro.IdPrestacion = vm.filter.prestacion ? vm.filter.prestacion.Id : 0; 
                vm.filter.filtro.IdSucursal = vm.filter.sucursal ? vm.filter.sucursal.Id : 0;
                vm.filter.filtro.IdServicio = vm.filter.servicio ? vm.filter.servicio.Id : 0;
                vm.filter.filtro.IdMutual = vm.filter.mutual.Id;
                vm.filter.filtro.IdPlan = vm.filter.plan ? vm.filter.plan.Id : 0;
                vm.filter.filtro.IdTipoAfiliado = vm.filter.tipoAfiliado ? vm.filter.tipoAfiliado.Id : 0;

				vm.formControl.loading = true;

				SimuladorDataService.simularPrecturarAmbulatorio(vm.filter.filtro)
				.then(function (result) {
					if(result.IsOk === true){
                        vm.formControl.prefacturaValida = true;
                        vm.data.prefactura = result.Prefactura;
						ModalService.success("Prefactura Calculada.");
					}
					else{
                        vm.formControl.prefacturaValida = false;
						if(result.Message != null) 
							ModalService.warning(result.Message);
					}
				});
				vm.formControl.loading = false;
			}

			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */
			activate();

			function limpiarFiltros() {
				 vm.filter.idPaciente = 0;
				 vm.filter.prestacion = null;
				 vm.filter.sucursal = null;
				 vm.filter.mutual = null;
				 vm.filter.servicio = null;
				 vm.filter.mutual = null;
				 vm.filter.plan = null;
				 vm.filter.fecha = new Date();
				 vm.filter.tipoAfiliado = null;
				 vm.filter.recurso = null;
				 vm.formControl.prefacturaValida = false;
			}



			function activate() {
                vm.formControl.loading = true;
                vm.filter.fecha = vm.today;
                vm.filter.prestacion = null;

				var _sucursales = SimuladorDataService.obtenerSucursales();
				var _servicios = SimuladorDataService.obtenerServicios();
				var _tiposAfiliado = SimuladorDataService.obtenerTiposAfiliado();
				var _filtroSimulador = SimuladorDataService.obtenerNuevoParametrosSimulacionPrefacturaAmbulatorio();

				$q.all([_sucursales, _servicios, _tiposAfiliado, _filtroSimulador])
					.then(activateOk, activateError);
			}

			function activateOk(results) {
				vm.data.sucursales = results[0];
				vm.data.servicios = results[1];
				vm.data.tiposAfiliado = results[2];
                vm.filter.filtro = results[3];
                vm.formControl.loading = false;
			}

			function activateError(pError) {
                vm.formControl.loading = false;
				ModalService.error(pError.message);
			}
		}
	};

	return module;
})();