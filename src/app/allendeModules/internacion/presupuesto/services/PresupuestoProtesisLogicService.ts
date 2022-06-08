/**
 * @author:			Ezequiel Mansilla
 * @description:	PrsupuestoProtesisLogicService
 * @type:			Service
 **/
import * as angular from 'angular';
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('PresupuestoProtesisLogicService', PresupuestoProtesisLogicService);

		PresupuestoProtesisLogicService.$inject = ['Logger', '$uibModal', 'DateUtils'];
		
		function PresupuestoProtesisLogicService ($log, $uibModal, DateUtils) {

			$log = $log.getInstance('PresupuestoProtesisLogicService');

			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			const service = {
				crearForNew : crearForNew,
				crearForEdit : crearForEdit,
				getPresupuesto : getPresupuesto,
				openNew : openNew,
				openEdit : openEdit,
				printOne : printOne
			};

			return service;

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			function crearForNew(pPresupuesto, pFechaVencimiento, pIdIntervencion) {
				var presupuesto = crearCommon(pPresupuesto, pFechaVencimiento);
				presupuesto.IdIntervencionAdmision = pIdIntervencion;
				presupuesto.Detalles = [];
				if (pPresupuesto.Detalles && pPresupuesto.Detalles.length) {
					for (var i = pPresupuesto.Detalles.length - 1; i >= 0; i--) {
						var detalle =pPresupuesto.Detalles[i];

						if (detalle.incluir)
							presupuesto.Detalles.push(detalle);
					}
				}
				return presupuesto;
			}

			function crearForEdit(pPresupuesto) {
				return crearCommon(pPresupuesto, pPresupuesto.FechaVencimiento);
			}

			function crearCommon (pPresupuesto, pFechaVencimiento) {
				var presupuesto = angular.copy(pPresupuesto);
				presupuesto.FechaVencimiento = DateUtils.parseToBe(pFechaVencimiento);
				return presupuesto;
			}
			
			function getPresupuesto (pPresupuesto) {
				var presupeusto = angular.copy(pPresupuesto);
				presupeusto.FechaVencimiento = DateUtils.parseToFe(pPresupuesto.FechaVencimiento);
				return presupeusto;
			}

			function openNew(pIdIntervencion) {
				return $uibModal.open({
					component: 'saPresupuestoProtesisNew',
					size : 'lg',
					resolve : {
						idIntervencion : function () {
							return pIdIntervencion;
						}
					}
				}).result;
			}

			function printOne(pId, pIdIntervencion) {
				return $uibModal.open({
					component: 'saPresupuestoProtesisPrint',
					size : 'lg',
					resolve : {
						id : function () {
							return pId;
						},
						idIntervencion : function () {
							return pIdIntervencion;
						}
					}
				}).result;
			}

			function openEdit(pId) {
				return $uibModal.open({
					component: 'saPresupuestoProtesisEdit',
					size : 'lg',
					resolve : {
						id : function () {
							return pId;
						}
					}
				}).result;
			}
		}
	};

	return module;

})();