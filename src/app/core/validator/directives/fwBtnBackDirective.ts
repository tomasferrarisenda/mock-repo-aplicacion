/**
 * @author:			Pablo Pautasso
 * @description:	Directiva para btn volver
 * @type:			Directive
 **/
import fwBtnBackTemplate = require('../templates/fw-btn-back.tpl.html');

export default (function () {
	'use strict';

	const module = { init : (ngModule: any) => {} };

	module.init = function(ngModule) {

		ngModule.directive('fwBtnBackDirective', fwBtnBackDirective);
		ngModule.directive('saBtnBackDirective', fwBtnBackDirective);

		fwBtnBackDirective.$inject = ['$log', 'ModalService'];

		function fwBtnBackDirective($log, ModalService): any {
			return {
				restrict: 'E',
				scope: {
					functionOk: '&?',
					functionCancel: '&?'
					
				},
				replace: true,
				require: '?^form',
				template: fwBtnBackTemplate,
				link: function(scope, element, attrs, form) {

					if (!form) return;

					scope.askIfDiry = askIfDiry;
					scope.volver = volver;

					const optionsObj = {
						ok : 'Si',
						cancel : 'No'
					};

					function askIfDiry() {

						if (form.$dirty) {
							// levanto modal

							ModalService.confirm('Atencion! Hubo cambios, ¿Desea grabarlos?',
								function(pResult) {
									$log.debug('pResult Modal confirm', pResult);
									if (pResult) {

										// guardo los cambios y vuelvo
										guardar();

									} else {
										 volver();
										// vuelvo
									}
								}, '', optionsObj);

						} else {
 							volver();
							// vuelvo	
						}
					}

					function volver() {
						scope.functionCancel();
					}

					function guardar() {
						scope.functionOk();
					}

				}
			};
		}
	};

	return module;
	
})();