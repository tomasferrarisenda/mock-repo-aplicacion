/**
 * @author 			emansilla
 * @description 	description
 */
import practicaListTemplate = require('../templates/practica-medica-list.tpl.html');
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('PracticaMedicaLogicService', PracticaMedicaLogicService);

		// Inyección de dependencia
		PracticaMedicaLogicService.$inject = ['Logger', '$uibModal', 'PracticaMedicaDataService']

		// Definición del servicio
		function PracticaMedicaLogicService ($log, $uibModal, PracticaMedicaDataService) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('PracticaMedicaLogicService');
			$log.debug('ON.-');
			
			/* ------------------------------------------ API Y VARIABLES ----------------------------------------- */

			const service = {
				openSelector: openModalSelector,
				openSelectorQuirofano : openSelectorQuirofano,
				selectPracticaMedica : selectPracticaMedica
			};

			return service;

			/* ------------------------------------------ IMPLEMENTACIÓN ------------------------------------------ */

			function openModalSelector (pUser, pType) {
				var _type;
				(pType) ? _type = pType : _type = null;

				return $uibModal.open({
					template: practicaListTemplate,
					controller: 'PracticaMedicaSelectorController',
					controllerAs: 'vm',
					size: 'lg',
					resolve: {
						User: function () {
							return pUser;
						},
						Type : function () {
							return _type;
						}
					}
				}).result;
			}

			function openSelectorQuirofano (pUser) {
				return PracticaMedicaDataService.getTipoQuirofano()
				.then(function (pType) {
					return openModalSelector(pUser, pType);
				});
			}

			function selectPracticaMedica (pCodigo, pPracticaMedicaList) {
				var _practicaReturn = '';

				if (pCodigo != '') {
					var _codigo = parseInt(pCodigo);
					for (var i = 0; i < pPracticaMedicaList.length; i++) {
						if (pPracticaMedicaList[i].codigo_practica_medica == _codigo) {
							$log.debug('IGUAL', _codigo);
							_practicaReturn = pPracticaMedicaList[i];
							$log.debug('SALIR');
							break;
						} else {
							$log.debug('DISTINTO');
							_practicaReturn = '';
						}
					};
				}

				return _practicaReturn;
			}

			// function getCodigoConCeros (pPracticaMedica) {
			// 	var _codigo = null;
			// 	if (!angular.isUndefined(pPracticaMedica)) {
			// 		if (pPracticaMedica) {
			// 			// $log.debug('nulla o no?', pPracticaMedica);
			// 			_codigo = ("00000" + pPracticaMedica.codigo_practica_medica).slice (-6);
			// 		}
			// 	} 
			// 	return _codigo;
			// }

		}
	};

	return module;

})();