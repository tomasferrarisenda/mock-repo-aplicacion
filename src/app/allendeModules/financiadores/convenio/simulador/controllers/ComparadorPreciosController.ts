/**
 * @author:			drobledo
 * @description:	Comparador de Precios Controller
 * @type:			Controller
 **/
import * as angular from 'angular';

export default (function () {
	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.controller('ComparadorPreciosController', ComparadorPreciosController);

		ComparadorPreciosController.$inject = ['Logger', '$state', 'ModalService',
			'SupportLogicService', '$q',
			'ICON_LIST', 'SimuladorDataService', 'DateUtils'];

		function ComparadorPreciosController($log, $state, ModalService,
			SupportLogicService, $q,
			ICON_LIST, SimuladorDataService, DateUtils) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('ComparadorPreciosController');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			var vm = this;
			vm.today = new Date();
			vm.ICON_LIST = ICON_LIST

			vm.title = {
				name: 'Comparador de Precios por Código',
				icon: 'BALANZA'
			};

			vm.data = {
				precios: [],
				parametros: null
			};

			vm.filter = {
				codigoNomenclador: '',
				nombreCodigoNomenclador: '',
				fecha: ''
			};

			vm.formControl = {
				loading: false,
				volver: volver,
				evaluar: evaluar,
				verDetalle: verDetalle
			};

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			/* METODOS */

			function volver() {
				$state.go('homesistemas');
			}

			function evaluar() {
				if (!vm.filter.codigoNomenclador || vm.filter.codigoNomenclador.Codigo == '') {
					ModalService.warning('El código es requerido para comparar los precios entre los distintos financiadores.');
					return;
				}
				vm.formControl.loading = true;

				SimuladorDataService.obtenerNuevoParametrosComparadorPreciosDto()
					.then(function (results) {
						vm.data.parametros = results;
						vm.data.parametros.Codigo = vm.filter.codigoNomenclador.Codigo;
						vm.data.parametros.Fecha = DateUtils.parseToBe(vm.filter.fecha);

						SimuladorDataService.compararPreciosPorCodigo(vm.data.parametros)
							.then(compararPreciosOk, compararPreciosError);
					})
					.catch(function (pError) {
						ModalService.error(pError.message);
					});

				vm.formControl.loading = false;
			}

			function compararPreciosOk(resultado) {
				vm.data.precios = resultado;
			}

			function compararPreciosError(error) {
				ModalService.error(error.message);
			}

			function verDetalle(row) {
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