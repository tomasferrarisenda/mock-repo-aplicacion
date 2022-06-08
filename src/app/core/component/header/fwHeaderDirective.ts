/**
 * @author:			Ezequiel Mansilla
 * @description:	
 * @type:			Directive
 **/
import * as angular from 'angular';
import fwHeaderTemplate = require("./fw-header.tpl.html");
import './fwHeader.scss';
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.directive('saHeader', fwHeader);
		ngModule.directive('fwHeader', fwHeader);

		fwHeader.$inject = ['ENV', 'DEBUG'];
		function fwHeader (ENV, DEBUG) {
			return {
				restrict : 'E',
				scope : {
					menuIf : '=?',
					nameModule : '@',
					pathModule : '@'
				},
				replace : true,
				template : fwHeaderTemplate,
				link : link
			};

			function link (scope, element, attrs) {
				scope.debug = DEBUG;
				scope.classHeader = ENV.CLASS;
				if (scope.classHeader == 'production') { 
					scope.whiteClass = true;
				}
				scope.menuIf = (angular.isUndefined(attrs.menuIf)) ? true : scope.menuIf;
			}
		}
	};

	return module;

})();