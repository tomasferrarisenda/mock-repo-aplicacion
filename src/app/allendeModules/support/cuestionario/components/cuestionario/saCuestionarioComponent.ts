/**
 * @author:			Martin Astore
 * @description:	Encuestas
 * @type:			Component
 **/
import * as angular from 'angular';
import saCuestionarioTemplate = require('./saCuestionarioTemplate.html');
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.component('saCuestionario', {
			template: saCuestionarioTemplate,
			bindings: {
				resolve: '<?',	// por ser Modal. An object of the modal resolve values
				close: '&?',		// por ser Modal. A method that can be used to close a modal, passing a result. 
								// 	Use: {$value: myResult}
				dismiss: '&?',	// por ser Modal. A method that can be used to dismiss a modal, passing a result.
								// 	Use: {$value: myRejectedResult}
				obtenerCuestionario: '<?'				
			},
			controller : CuestionarioController,
			controllerAs : 'vm'
		});

		CuestionarioController.$inject = ['$q','Logger', 'CuestionarioDataService', 'AlertaService'];
		function CuestionarioController ($q, $log, CuestionarioDataService,AlertaService) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('saCuestionario');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			var vm = this;
			// vm.today = new Date();
			vm.$onInit = activate;
			vm.$onChanges = updateComponent;
			vm.update = update;
			vm.ok = ok;
			vm.cancel = cancel;
			vm.cuestionarioCargado = false;


			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			function updateComponent () {
				$log.debug('updateComponent');
				
			}

			function update() {
				vm.faltanRespuestas = false;
				if(vm.cuestionario)
				{
					for (var i = vm.cuestionario.Items.length - 1; i >= 0; i--) {
						if(vm.cuestionario.Items[i].IdItemCuestionarioPadre != 0)
						{
							vm.cuestionario.Items[i].Visible = false;
							for (var j = 0; j < vm.cuestionario.Items.length; j++) {
								if(vm.cuestionario.Items[j].Id == vm.cuestionario.Items[i].IdItemCuestionarioPadre)
								{
									for (var k = 0; k < vm.cuestionario.Items[i].IdsValoresItemPadre.length; k++) {
										for (var l = 0; l < vm.cuestionario.Items[j].Valores.length; l++) {
											if(vm.cuestionario.Items[j].Valores[l].Id == vm.cuestionario.Items[i].IdsValoresItemPadre[k] && 
												vm.cuestionario.Items[j].Valores[l].Seleccionado)
												vm.cuestionario.Items[i].Visible = true;
										}
									}
								}
							}
						}
						if(!vm.cuestionario.Items[i].Valor)
						{
							var haySeleccionado = false;
							for (var j = 0; j < vm.cuestionario.Items[i].Valores.length; j++) {
								if(vm.cuestionario.Items[i].Valores[j].Seleccionado)
									haySeleccionado = true;

							}
							if(!haySeleccionado)
								vm.faltanRespuestas = true;
						}
					}
				}
			}

			function ok () {
				CuestionarioDataService.Guardar(vm.cuestionario)
					.then(function () {
						AlertaService.NewSuccess('Cuestionario guardado');
						vm.close({$value: 'ok'});
					});
			}

			function cancel () {
				vm.dismiss({$value: 'cancel'});
			}


			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */

			function initData() {
				vm.cuestionarioCargado = false;
				if(vm.resolve && vm.resolve.obtenerCuestionario)
				{
					vm.obtenerCuestionario = vm.resolve.obtenerCuestionario;
					vm.extraInfo = vm.resolve.InfoExtra;
					vm.modal = true;
				}
					// vm.obtenerCuestionario={
					// 	tipoCuestionario: 2,
					// 	IdTipoEntidad: 1,
					// 	IdEntidad: 25769
					// };
					CuestionarioDataService.GetByTipoYEntidad(vm.obtenerCuestionario.tipoCuestionario,
																vm.obtenerCuestionario.idTipoEntidad,
																vm.obtenerCuestionario.idEntidad)
						.then(function (pCuestionario) {
							$log.debug('cuestionario',pCuestionario);
							// vm.cuestionarioView = CuestionarioLogicService.GetCuestionarioView(pCuestionario);
							// $log.debug('cuestionarioView',vm.cuestionarioView);
							vm.cuestionario = angular.copy(pCuestionario);
							vm.cuestionarioBack = angular.copy(pCuestionario);
							vm.title = vm.cuestionario.Nombre;
							// ctrl.formData = vm.cuestionarioView;
							vm.cuestionarioCargado = true;
							update()
							
						})
				

				function initDataOk(pCuestionario) {
				}

				function initDataError(pError) {
					cancel();
				}
			}
			function activate () {
				$log.debug('$onInit');
				// vm.idIntervencion = vm.resolve.idIntervencion;
				initData();
			}
		}
	};

	return module;

})();