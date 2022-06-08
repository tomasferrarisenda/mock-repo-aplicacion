/**
 * @author 			emansilla
 * @description 	description
 */
import * as angular from 'angular';

import titleTemplate = require("./sa-title.tpl.html");

export default (function () {
	'use strict';
	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		// UTILIDADES: [DIRECTIVE] Título para páginas con botones a la derecha.
		ngModule.directive('saTitle', saTitle);

		saTitle.$inject = ['ButtonService', 'ModalService'];
		function saTitle (ButtonService, ModalService: IModalService) {
			return {
				restrict : 'E',
				scope : {
					titleName : '=',

					today : "=?",
					small : "=?",
					titleIcon : '@',

					btnNewClick : '&?',
					btnNewDisabled : '=?',
					btnNewIf : '=?',

					btnPrintClick : '&?',
					btnPrintDisabled : '=?',
					btnPrintIf : '=?',

					btnSearchClick : '&?',
					btnSearchDisabled : '=?',
					btnSearchIf : '=?',

					btnReloadClick : '&?',
					btnReloadDisabled : '=?',
					btnReloadIf : '=?',
				
					btnPersonalizadoClass: '@?',
					btnPersonalizadoClick : '&?',
					btnPersonalizadoDisabled : '=?',
					btnPersonalizadoIf : '=?',
					btnPersonalizadoIconIf : '=?',
					btnToolTipPersonalizado : '@?',
					btnPersonalizadoName : '@?',

					switchIf: '=?',
					switchLabel: '@?',
					switchModel: '=?',

					alertas : '=?',
					alertasIf: '=?'

				},
				// replace : true,
				template : titleTemplate,
				link : function (scope, element, attrs) {
					scope.date = new Date();

					scope.btnPersonalizadoClass = (angular.isUndefined(scope.btnPersonalizadoClass)) ? "btn-default" : scope.btnPersonalizadoClass;
					scope.switchIf = angular.isUndefined(scope.switchIf) ? false : scope.switchIf;

					scope.btnHelpClick = btnHelpClick;

					ButtonService.validarButtons(scope);

					scope.changeSwitch = changeSwitch;

					function btnHelpClick() {
						ModalService.media().then(a => console.debug('cerrar'));
					}

					function changeSwitch(switchModel) {
						scope.switchModel = angular.copy(switchModel);
					}

					scope.$watch(function () {
						return scope.switchModel;
					}, updateDirective);

					function updateDirective(_model) {
						scope.switchModelInterno = angular.copy(_model);
					}

				}
			};
		}
	};

	// La diferencia entre la función de link es que el código del controlador se ejecuta antes de la compilación 
	// y el del link después

	return module;
})();