/**
 * @author 			ppautasso
 * @description 	description
 */
import * as angular from 'angular';
import { ISucursalDataService } from '../services';

export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function(module) {

		module.controller('SucursalOptionalSelectorController', SucursalOptionalSelectorController);

		// Inyección de Dependencia
		SucursalOptionalSelectorController.$inject = ['Logger', '$filter', '$q', '$uibModalInstance',
			'SucursalDataService',
			'Title', 'SucursalOpt', 'Accion'
		];

		// Constructor del Controller
		function SucursalOptionalSelectorController($log, $filter, $q, $uibModalInstance,
			SucursalDataService: ISucursalDataService,
			Title, SucursalOpt, Accion
		) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('SucursalOptionalSelectorController');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			var vm = this;
			vm.title = {
				page: Title

			};

			vm.formData = {
				sucursalSeleccionada: null
			};

			vm.data = {
				sucursales: [],
				sucursalesOpt: [],
				accion: Accion
			};

			vm.formControl = {
				loading: false,
				noResult: true,
				ok: returnMutual,
				cancel: cancel,
				reloadPage: activate,
				validarForm: validarForm,
				selectRow : selectRow
			};

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			/* FORMULARIO */

			function validarForm() {
				var _flag = false;

				if (vm.formData.sucursalSeleccionada && !angular.isUndefined(vm.formData.sucursalSeleccionada.id_sucursal))
					_flag = true;

				return _flag;
			}

			function cancel() {
				$uibModalInstance.dismiss('close');
			}

			function optionalSucursal(data) {

				vm.data.sucursales = data.filter(function(e) {

					return this.indexOf(e.id_sucursal) < 0;
				}, vm.data.sucursalesOpt);

				if (vm.data.accion == true) {

					data = data.filter(function(e) {

						return this.indexOf(e) < 0;
					}, vm.data.sucursales);

					vm.data.sucursales = data;

				}
			}

			function returnMutual() {
				$uibModalInstance.close(vm.formData.sucursalSeleccionada);
			}

			/* OTROS */

			function inicializarVariables() {
				vm.data.sucursales = [];
			}

			function selectRow(rowSelected) {
				$uibModalInstance.close(rowSelected);
				
			}

			/* -------------------------------------------- ACTIVATE -------------------------------------------- */

			activate();

			function activate() {



				$log.debug('Inicializar ON.-');

				vm.data.sucursalesOpt = SucursalOpt;
				$log.debug('SucursalOpt ON.-', vm.data.sucursalesOpt);

				inicializarVariables();
				vm.formControl.loading = true;

				var _sucursales = SucursalDataService.getAllSucursalesSinTodas();

				$q.all([_sucursales])
					.then(activateOk, activateError);
			}

			function activateOk(pResults) {
				vm.formControl.loading = false;
				vm.data.sucursales = pResults[0];

				$log.debug('Inicializar OK.-');

				optionalSucursal(pResults[0]);

			}

			function activateError(pError) {
				$uibModalInstance.dismiss(pError);
				$log.error('Inicializar ERROR.-', pError);
			}
		}
	}

	return module;

})();