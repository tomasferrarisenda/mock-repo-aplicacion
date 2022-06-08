/**
 * @author:			drobledo
 * @description:	Simulador de Lista de Precios Controller
 * @type:			Controller
 **/

import * as angular from 'angular';

export default (function () {
	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.controller('SimuladorListaPreciosController', SimuladorListaPreciosController);

		SimuladorListaPreciosController.$inject = ['Logger', '$state', 'ModalService',
			'SupportLogicService', '$q', 
			'ICON_LIST', 'SimuladorDataService', 'DateUtils', 'moment'];

		function SimuladorListaPreciosController($log, $state, ModalService,
			SupportLogicService, $q, 
			ICON_LIST, SimuladorDataService, DateUtils, moment) {

		/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('SimuladorListaPreciosController');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			var vm = this;
			vm.today = new Date();
			vm.ICON_LIST = ICON_LIST

			vm.title = {
				name: 'Simulador de Precios por Mutual',
				icon: 'PESOS'
			};

			vm.data = {
				listaPrecios: [],
				parametros: null
			};

			vm.filter = {
				mutualElegida: {},
				fecha: '',
			};

			vm.formControl = {
				loading: false,
				volver: volver,
				evaluar: evaluar,
				verDetalle: verDetalle,
				start: start
			};

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */
			function start() {
				//SimuladorDataService.tareaLarga('hola');
				//// ProgressHubService.update();
			}
			function volver() {
				$state.go('homesistemas');
			}

			function evaluar() {
				delete vm.data.listaPrecios ;
				if (vm.filter.mutualElegida == null || vm.filter.mutualElegida == '') {
					ModalService.warning('La mutual es requerida para simular la lista de precios.');
					return;
				}
				vm.formControl.loading = true;

				SimuladorDataService.obtenerConvenioVigenteALaFecha(vm.filter.mutualElegida.Id, moment(vm.filter.fecha).format('MM-DD-YYYY'))
				.then(function (result){
					if (result == null){
						ModalService.warning('La mutual no tiene convenio vigente a la fecha especificada.');						
						vm.formControl.loading = false;
						return;
					}

					SimuladorDataService.obtenerNuevoParametrosSimulacionListaPreciosDto()
					.then(function (results) {
						vm.data.parametros = results;
						vm.data.parametros.IdMutual = vm.filter.mutualElegida.Id;
						vm.data.parametros.Fecha = DateUtils.parseToBe(vm.filter.fecha);
	
						SimuladorDataService.simularPreciosPorMutual(vm.data.parametros)
						.then(simularPreciosOk, simularPreciosError);
					})
					.catch(function (pError) {
						ModalService.error(pError.message);
					});
	
					vm.formControl.loading = false;
				});
			}

			function simularPreciosOk(resultado){
				vm.data.listaPrecios = resultado;
			}

			function simularPreciosError(error){
				ModalService.error(error.message);
			}

			function verDetalle(row){
				ModalService.info("Detalle: " + row.DescripcionCompleta);
			}

			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */
			activate();

			function activate() {
				vm.filter.fecha = vm.today;
			}
		}
	};

	return module;
})();