/**
 * @author 			emansilla
 * @description 	description
 */
import tipoAltaTemplate = require('../templates/tipo-alta-selector.tpl.html');
export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('InternacionCommonLogicService', InternacionCommonLogicService);

		InternacionCommonLogicService.$inject = ['Logger', '$uibModal', '$window',
			'AuthorizationService', 'PrintSelectionService', 'PreadmisionLogicService',
			'INTERNACION_INFO'];
		
		function InternacionCommonLogicService ($log, $uibModal, $window,
			AuthorizationService, PrintSelectionService, PreadmisionLogicService,
			INFO) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('InternacionCommonLogicService');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			const service = {
				openTipoAltaSelector : openTipoAltaSelector,
				crearObservacion : crearObservacion,
				openBuscadorInternado: openBuscadorInternado,
				openInfoBuscadorInternado: openInfoBuscadorInternado
			};

			return service;

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			function openTipoAltaSelector (pUser) {
				return $uibModal.open({
					template: tipoAltaTemplate,
					controller: 'TipoAltaInternacionSelectorController',
					controllerAs : 'vm',
					size: 'md',
					resolve: {
						User : function () {
							return pUser;
						},
						Title : function () {
							return 'Seleccionar Tipo de Alta de Internación';
						},
						Module : Module
					}
				}).result;
			}

			function crearObservacion (pObservacion, pIdInternacion, pUser) {
				$log.debug('Input', pObservacion, pUser);
				var _obj = {};

				_obj['observaciones'] = pObservacion;
				_obj['userName'] = pUser.userName;
				_obj['idInternacion'] = pIdInternacion;

				return _obj;
			}

			function openBuscadorInternado() {
				return $uibModal.open({
					component: 'saBuscadorInternadoModal',
					size: 'lg'
				}).result;
			}

			function openInfoBuscadorInternado(pInfo){
				return $uibModal.open({
					component: 'saInformacionInternadoModal',
					size: 'md',
					resolve: {
						Informacion : function () {
							return pInfo;
						}
					}
				}).result;
			}
			
			function Module () {
				return INFO.title;
			}
			
		}
	};

	return module;

})();