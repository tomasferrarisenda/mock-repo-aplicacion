/**
 * @author:			Pablo Pautasso
 * @description:	controller para centro de servicios
 * @type:			Controller
 **/
import * as angular from 'angular';
import { IServiciosGestionDataService } from '../../../servicios/gestion/services/ServiciosGestionDataService';
import { IPrestacionGestionDataService } from '../../../prestaciones/gestion/services/PrestacionGestionDataService';
import { IRecursosDataService } from '../../../recursos/gestion/services/RecursosDataService';

export default (function () {
	'use strict';

	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.controller('CentroServicioController', CentroServicioController);

		CentroServicioController.$inject = [
			'Logger', '$q',
			'AlertaService', 'ModalService',
			'ServiciosGestionDataService', 'RecursosDataService', 'PrestacionGestionDataService',
			'SelectorService'
		];

		function CentroServicioController(
			$log, $q,
			AlertaService: IAlertaService, ModalService: IModalService,
			ServiciosGestionDataService: IServiciosGestionDataService, RecursosDataService: IRecursosDataService, PrestacionGestionDataService: IPrestacionGestionDataService,
			SelectorService: ISelectorService
		) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('CentroServicioController');
			$log.debug('ON.-');

			/* ----------------------------------------- API Y VARIABLESES ----------------------------------------- */

			var vm = this;
			vm.today = new Date();

			vm.title = {
				page: "CENTRO DE SERVICIOS - PRESTACIONES",
				icon: 'PLUS'
			};

			vm.data = {
				servicios: '',
				showGrupoDePrestaciones: false,
				servicioSelected: {},
				recursoSelected: {}
			}

			vm.formControl = {
				loading: false,
				changeSucursal: changeSucursal
			}


			vm.optionsObj = {
				ok: 'Si',
				cancel: 'No'
			};
			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */


			function changeSucursal() {
				// delete vm.data.servicioSelected;
				// delete vm.data.recursoSelected;
			}
			/* FORMULARIO */


		}
	};

	return module;
})();
