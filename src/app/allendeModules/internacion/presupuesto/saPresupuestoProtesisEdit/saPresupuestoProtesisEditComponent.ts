/**
 * @author:			Ezequiel Mansilla
 * @description:	Nuevo presupuesto protesis
 * @type:			Component
 **/
import presupuestoTemplate = require('./saPresupuestoProtesisEditTemplate.html');
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.component('saPresupuestoProtesisEdit', {
			template: presupuestoTemplate,
			bindings: {
				resolve: '<',	// por ser Modal. An object of the modal resolve values
				close: '&',		// por ser Modal. A method that can be used to close a modal, passing a result. 
								// 	Use: {$value: myResult}
				dismiss: '&',	// por ser Modal. A method that can be used to dismiss a modal, passing a result.
								// 	Use: {$value: myRejectedResult}
				
			},
			controller : PresupuestoProtesisEditController,
			controllerAs : 'vm'
		});

		PresupuestoProtesisEditController.$inject = ['Logger', 'PresupuestoProtesisDataService', 'PresupuestoProtesisLogicService'];
		function PresupuestoProtesisEditController ($log, PresupuestoProtesisDataService, PresupuestoProtesisLogicService) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('saPresupuestoProtesisEdit');
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
				var presupuesto = PresupuestoProtesisLogicService.crearForEdit(vm.presupuesto);
				PresupuestoProtesisDataService.Update(presupuesto)
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
				PresupuestoProtesisDataService.GetOne(vm.resolve.id)
				.then(initDataOk, initDataError);

				function initDataOk(pPresupuesto) {
					vm.loading = false;
					vm.presupuesto = PresupuestoProtesisLogicService.getPresupuesto(pPresupuesto);
				}

				function initDataError(pError) {
					vm.loading = false;
					cancel();
				}
			}
			
			function activate () {
				$log.debug('$onInit');
				vm.id = vm.resolve.id;
				initData();
				$log.debug('$onInit: OK');
			}
		}
	};

	return module;

})();