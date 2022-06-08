/**
 * @author 			emansilla
 * @description 	description
 */
import profesionalListView = require('../templates/profesional-list.tpl.html');
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('ProfesionalLogicService', ProfesionalLogicService);

		ProfesionalLogicService.$inject = ['Logger', '$uibModal'];

		function ProfesionalLogicService ($log, $uibModal) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('ProfesionalLogicService');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */
			
			const service = {
				openModal: openModal
			};

			return service;

			/* ------------------------------------------ IMPLEMENTACIÓN ------------------------------------------ */

			/**
			 * [Abre modal para seleccionar un profesional]
			 * @param  {[User]} pUser   [Usuario logueado]
			 * @param  {[bool]} pDetail [Si debe traer profesional completo]
			 * @return {[Profesional]}  [Profesional]
			 */
			function openModal (pUser, pDetail) {
				var _modalInstance;

				_modalInstance = $uibModal.open({
					template: profesionalListView,
					controller: 'ProfesionalListController',
					size: 'lg',
					resolve: {
						User: function () {
							return pUser;
						},
						Detail : function () {
							return pDetail;
						}
					}
				});

				return _modalInstance.result;
			}
		};
	};

	return module;

})();