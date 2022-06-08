/**
 * @author:			Ezequiel Mansilla
 * @description:	Directiva para formularios
 * @type:			Directive
 **/
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.directive('ngForm', ngForm);
		// ngFrm.$inject = [];
		function ngForm () {
			return {
				estrict: 'EA',
				require: 'form',
				link: link
			};

			function link (scope, element, attrs, formController) {
				scope.$on('$submitted', function() {
					formController.$setSubmitted();
				});
			}
		}
	};

	return module;

})();