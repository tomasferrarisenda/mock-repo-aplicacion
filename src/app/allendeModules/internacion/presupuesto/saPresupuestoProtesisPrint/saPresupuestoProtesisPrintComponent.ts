/**
 * @author:			Ezequiel Mansilla
 * @description:	Nuevo presupuesto protesis
 * @type:			Component
 **/
import printTemplate = require('./saPresupuestoProtesisPrintTemplate.html');
import { ICredentialsDataService } from 'core/security';
export default (function () {
	'use strict';

	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.component('saPresupuestoProtesisPrint', {
			template: printTemplate,
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

		PresupuestoProtesisEditController.$inject = ['Logger', '$q', 'PresupuestoProtesisDataService', 'PresupuestoProtesisLogicService',
			'IntervencionDataService', 'CredentialsDataService'];
		function PresupuestoProtesisEditController ($log, $q, PresupuestoProtesisDataService, PresupuestoProtesisLogicService,
			IntervencionDataService, CredentialsDataService: ICredentialsDataService) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('saPresupuestoProtesisPrint');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			var vm = this;
			vm.title = {
				page : 'Presupuesto de elementos - Solicitud N° '
			};
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

				$q.all([
					PresupuestoProtesisDataService.GetOne(vm.resolve.id),
					IntervencionDataService.GetInternacion(vm.resolve.idIntervencion)
				])
				.then(initDataOk, initDataError);

				function initDataOk(pResult) {
					vm.loading = false;
					vm.presupuesto = PresupuestoProtesisLogicService.getPresupuesto(pResult[0]);
					vm.internacion = pResult[1];
					initTitle();
					setTimeout(function (){ window.print(); }, 100);
				}

				function initDataError(pError) {
					vm.loading = false;
					cancel();
				}
			}

			function initTitle() {
				vm.title.page += vm.internacion.id_internacion;
			}

			function initResolve() {
				vm.id = vm.resolve.id;
				vm.user = CredentialsDataService.GetForce();
			}
			
			function activate () {
				$log.debug('$onInit');
				initResolve();
				initData();
				$log.debug('$onInit: OK');
			}
		}
	};

	return module;
})();