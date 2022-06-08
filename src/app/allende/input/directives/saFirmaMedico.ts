import { ISupportDataService } from '../../../allendeModules/support/basic/services';

/**
 * @author 			emansilla
 * @description 	description
 */
export default (function () {
	'use strict';

	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.directive('saFirmaMedico', saFirmaMedico);

		saFirmaMedico.$inject = ['SupportDataService'];
		function saFirmaMedico (SupportDataService: ISupportDataService) {
			return {
				restrict : 'E',
				scope : {
					matricula : '=',
				},
				template : '<img ng-src="{{firmaMedico}}" alt="firmaMedico" class="img-responsive"/>',
				link : function (scope, element, attrs) {
					SupportDataService.getFirmaMedico(scope.matricula)
					.then(function (pFirma) {
						scope.firmaMedico = 'data:image/jpeg;base64,' + pFirma.stream;
					});
				}
			};
		}
	};

	return module;
})();