/**
 * @author:			Ezequiel Mansilla
 * @description:	Directiva para loading spinner
 * @type:			Directive
 **/
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.directive('fwWorkSpinner', fwWorkSpinner);

		fwWorkSpinner.$inject = ['$log', 'HttpRequestCounter'];
		function fwWorkSpinner ($log, HttpRequestCounter) {
			return {
				restrict : 'E',
				transclude : true,
				scope : {},
				template : '<ng-transclude ng-show="requestCounter"></ng-transclude>',
				link: function (scope, element, attrs) {
					
					scope.$watch(function () {
						return HttpRequestCounter.getRequestCount();
					}, function (requestCounter) {
						scope.requestCounter = requestCounter;
					});
				}
			};
		}
	};

	return module;

})();