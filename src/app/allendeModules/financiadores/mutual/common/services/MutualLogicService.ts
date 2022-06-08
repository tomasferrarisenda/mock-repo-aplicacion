/**
 * @author 			emansilla
 * @description 	description
 */
import abrirPlanMutualSelector = require('../templates/plan-list-selector.tpl.html');
import abrirMutualOldSelector = require('../templates/mutual-list-selector.tpl.html');
import abrirPlanMutual = require('../templates/sa-plan-edit.tpl.html');
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('MutualLogicService', MutualLogicService);

		// Inyección de dependencia
		MutualLogicService.$inject = ['Logger', '$uibModal', 'TITLE_MUTUAL'];

		// Definición del servicio
		function MutualLogicService ($log, $uibModal, TITLE_MUTUAL) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('MutualLogicService');
			$log.debug('ON.-');
			
			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */
			
			const service = {
				openPlanMutualSelector : openPlanMutualSelector,
				openMutualOldSelector : openMutualOldSelector,
				openMutualSelector : openMutualOldSelector,
				changePlanDefecto : changePlanDefecto,
				validaPlanDefecto : validaPlanDefecto,
				findElements : findElements,
				openPlanMutual : openPlanMutual
			};

			return service;

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			function Module () {
				return  'MUTUAL';
			}
			
			function openPlanMutualSelector () {
				return $uibModal.open({
					template : abrirPlanMutualSelector,
					controller : 'PlanMutualSelectorController',
					controllerAs : 'vm',
					keyboard : true,
					size : 'lg',
					resolve : {
						Module : Module,
						Title : function () {
							return TITLE_MUTUAL.PLAN_SELECTOR;
						}
					}
				}).result;
			}

			function openMutualOldSelector (pUser) {
				return $uibModal.open({
					template : abrirMutualOldSelector,
					controller : 'MutualSelectorController',
					controllerAs : 'vm',
					keyboard : true, 
					size : 'lg',
					resolve : {
						User: function () {
							return pUser;
						},
						Module : Module,
						Title : function () {
							return TITLE_MUTUAL.MUTUAL_SELECTOR;
						}
					}
				}).result;
			}

			function openPlanMutual (plan) {
				return $uibModal.open({
					template : abrirPlanMutual,
					controller : 'PlanMutualController',
					controllerAs : 'vm',
					keyboard : true,
					size : 'md',
					resolve : {
						Plan : function () {
							return plan;
						}
					}
				}).result;
			}
			function changePlanDefecto (pPlan, pListPlan) {				
				for (var i = 0; i < pListPlan.length; i++) {
					if (pListPlan[i].$$hashKey != pPlan.$$hashKey)
						pListPlan[i].PorDefecto = false;
				}
				validaPlanDefecto(pListPlan);
			}

			function validaPlanDefecto ( pListPlan) {		
				//$log.debug('validaTelefonoDefecto:', pListTelefono);
				var bDefectoOk = false;
				for (var i = 0; i < pListPlan.length; i++) {
					if(pListPlan[i].PorDefecto) {
						bDefectoOk = true;
						break;
					}
				}
				if (!bDefectoOk && pListPlan.length){
					pListPlan[0].PorDefecto = true;	
					//$log.debug('validaTelefonoDefecto ok false:', pListTelefono[0]);
				}
			}

			function findElements(array, itemSearch) {
				var matchingIndices = -1;

				for(var j = 0; j < array.length; j++)
				{
					if(itemSearch == array[j].Id)
					{	
						matchingIndices = j;
						break;
					}	
				}
				return matchingIndices;
			}
		}
	};

	return module;

})();