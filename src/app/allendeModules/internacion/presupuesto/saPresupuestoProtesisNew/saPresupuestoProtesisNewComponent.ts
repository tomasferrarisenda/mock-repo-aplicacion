/**
 * @author:			Ezequiel Mansilla
 * @description:	Nuevo presupuesto protesis
 * @type:			Component
 **/
import newTemplate = require('./saPresupuestoProtesisNewTemplate.html');
export default (function () {
	'use strict';
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.component('saPresupuestoProtesisNew', {
			template: newTemplate,
			bindings: {
				resolve: '<',	// por ser Modal. An object of the modal resolve values
				close: '&',		// por ser Modal. A method that can be used to close a modal, passing a result. 
								// 	Use: {$value: myResult}
				dismiss: '&',	// por ser Modal. A method that can be used to dismiss a modal, passing a result.
								// 	Use: {$value: myRejectedResult}
				
			},
			controller : PresupuestoProtesisNewController,
			controllerAs : 'vm'
		});

		PresupuestoProtesisNewController.$inject = ['Logger', 'PresupuestoProtesisDataService', 'PresupuestoProtesisLogicService'];
		function PresupuestoProtesisNewController ($log, PresupuestoProtesisDataService, PresupuestoProtesisLogicService) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('saPresupuestoProtesisNew');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			var vm = this;
			vm.today = new Date();
			vm.$onInit = activate;
			vm.$onChanges = updateComponent;
			vm.ok = ok;
			vm.cancel = cancel;

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			function updateComponent () {
				// Cuando cambia algun valor de bindings
			}

			function ok () {
				vm.loading = true;
				var presupuesto = PresupuestoProtesisLogicService.crearForNew(vm.presupuesto, vm.fechaVencimiento, vm.idIntervencion);
				PresupuestoProtesisDataService.Add(presupuesto)
				.then(successCallback, errorCallback);

				function successCallback(pPresupuesto) {
					vm.loading = false;
					vm.close({$value: pPresupuesto});
				}

				function errorCallback(pError) {
					vm.loading = false;
				}
			}

			function cancel () {
				vm.dismiss({$value: 'cancel'});
			}

			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */

			function initData() {
				vm.loading = true;
				PresupuestoProtesisDataService.New(vm.resolve.idIntervencion)
				.then(initDataOk, initDataError);

				function initDataOk(pPresupuesto) {
					vm.loading = false;
					vm.presupuesto = pPresupuesto;
				}

				function initDataError(pError) {
					vm.loading = false;
					cancel();
				}
			}
			
			function activate () {
				$log.debug('$onInit');
				vm.idIntervencion = vm.resolve.idIntervencion;
				initData();
				$log.debug('$onInit: OK');
			}
		}
	};

	return module;
})();