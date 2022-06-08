/**
 * @author:			Martin Astore
 * @description:	Encuestas Pregunta
 * @type:			Component
 **/
import saCuestionarioItemTemplate = require('./saCuestionarioItemTemplate.html');
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.component('saCuestionarioItem', {
			template: saCuestionarioItemTemplate,
			bindings: {
				pregunta: '=',
				update: '&'				
			},
			controller : CuestionarioItemController,
			controllerAs : 'vm'
		});

		CuestionarioItemController.$inject = ['Logger'];
		function CuestionarioItemController ($log) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('saCuestionarioItem');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			var vm = this;

			vm.$onInit = activate;
			vm.$onChanges = updateComponent;
			vm.onUpdate = onUpdate;


			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			function updateComponent () {
				
			}

			function onUpdate() {
				$log.debug('updateItem');
				switch (vm.pregunta.TipoDeDato)
				{
					case 'select':
						for (var i = vm.pregunta.Valores.length - 1; i >= 0; i--) {
							vm.pregunta.Valores[i].Seleccionado = false;
							if(vm.pregunta.Seleccionado && vm.pregunta.Valores[i].Id == vm.pregunta.Seleccionado.Id)
								vm.pregunta.Valores[i].Seleccionado = true;
						}
						break;
					case 'radio':
						for (var i = vm.pregunta.Valores.length - 1; i >= 0; i--) {
							vm.pregunta.Valores[i].Seleccionado = false;
							if(vm.pregunta.Seleccionado && vm.pregunta.Valores[i].Id == vm.pregunta.Seleccionado.Id)
								vm.pregunta.Valores[i].Seleccionado = true;
						}
						break;
				}
				vm.update();
			}

			function ok () {

			}

			function cancel () {
				vm.dismiss({$value: 'cancel'});
			}


			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */

			function initData() {
				switch (vm.pregunta.TipoDeDato)
				{
					case 'select':
						for (var i = vm.pregunta.Valores.length - 1; i >= 0; i--) {
							if(vm.pregunta.Valores[i].Seleccionado)
								vm.pregunta.Seleccionado = vm.pregunta.Valores[i];
						}
						$log.debug('initData seleccionado',vm.pregunta.Seleccionado);
						break;
					case 'radio':
						for (var i = vm.pregunta.Valores.length - 1; i >= 0; i--) {
							if(vm.pregunta.Valores[i].Seleccionado)
								vm.pregunta.Seleccionado = vm.pregunta.Valores[i];
						}
						$log.debug('initData radio',vm.pregunta.Seleccionado);
						break;
				}
			}

			function activate () {
				initData();
			}
		}
	};

	return module;

})();