/**
 * @author:			Ezequiel Mansilla
 * @description:	Directiva para formularios
 * @type:			Directive
 **/
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.directive('form', form);
		// form.$inject = [];
		function form () {
			return {
				restrict : 'E',
				require: 'form',
				link: link
			};

			function link (scope, element, attrs, formController) {
				scope.$watch(function() {
					return formController.$submitted;
				}, function(submitted) {
					submitted && scope.$broadcast('$submitted');
				});
			}
		}
	};

	return module;

})();