/**
 * @author 			emansilla
 * @description 	description
 */
import * as angular from 'angular';
export default (function(){
	'use strict';
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) { 

		module.controller('PlanMutualController', PlanMutualController);

		// Inyección de Dependencia
		PlanMutualController.$inject = ['Logger', '$filter', '$q', '$uibModalInstance','MutualDataService', 'Plan'];

		// Constructor del Controller
		function PlanMutualController ($log, $filter, $q, $uibModalInstance,MutualDataService, Plan) {

			/* ------------------------------------------------- LOG ------------------------------------------------- */

			$log = $log.getInstance(this.constructor.name);
			$log.debug('ON.-');

				/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

				var vm = this;

				vm.title = {
					name : '',
					icon : ''
				};

				vm.data = {
					plan : {}
				};

				vm.filter = {
					codigoMapeo : null,
					nombre : '',
					planSegunAutorizador : '',
					activo : 0
				}

				vm.formControl = {
					guardar: guardar,
					cancelar : cancelar
				};

				/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

 				/* FORMULARIO */

 				function cancelar () {
 					$uibModalInstance.dismiss('close');
 				}

 				function guardar () {
					vm.data.plan.CodigoMutualMapeo = vm.filter.codigoMapeo ? vm.filter.codigoMapeo : 0 ;
					vm.data.plan.Nombre = vm.filter.nombre;
					vm.data.plan.PlanSegunAutorizador = vm.filter.planSegunAutorizador;
					vm.data.plan.Activo = vm.filter.activo
					$uibModalInstance.close(vm.data.plan);
 				}

 				/* -------------------------------------------- ACTIVATE -------------------------------------------- */
 				activate();
				
				function activate () {
					vm.data.plan = Plan;
					vm.title.name = vm.data.plan.Id === 0 ? 'Nuevo Plan' : 'Editar Plan';
					vm.title.icon = vm.data.plan.Id === 0 ? 'NEW2' : 'EDIT';

					vm.filter.codigoMapeo = vm.data.plan.CodigoMutualMapeo;
					vm.filter.nombre = vm.data.plan.Nombre;
					vm.filter.planSegunAutorizador = vm.data.plan.PlanSegunAutorizador;
					vm.filter.activo = vm.data.plan.Id ? vm.data.plan.Activo : true;
				}
			}
	};

	return module;
})();