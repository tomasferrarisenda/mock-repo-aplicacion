/**
 * @author:			Ezequiel Mansilla
 * @description:	Items del menú
 * @type:			Directive
 **/
import * as angular from 'angular';
import fwMenuItemTemplate = require("./fwMenuItemTemplate.html");
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.directive('fwMenuItem', fwMenuItem);

		fwMenuItem.$inject = ['$log'];
		function fwMenuItem ($log) : any {
			return {
				restrict : 'E',
				require : '^fwMenuContainer',
				scope : {
					route : '=',
					iconName : '@?',	// Nombre de icono correspondiente a ICONS. Para usar fw-icon
					icon : '=?',		// Nombre de clase de algún icon glapycon o fa.
					iconClass : '@?',	// Clases adicionales para el icono
					label : '=',
					showLabel : '=?'
				},
				replace : true,
				template : fwMenuItemTemplate,
				link: function (scope, element, attrs, controller) {
					scope.sinDatos = 'Sin datos';
					scope.showLabel = (angular.isUndefined(attrs.showLabel)) ? false : scope.showLabel;
					scope.isActive = isActive;

					function isActive() {
						return scope.route === controller.getActiveItem();
					}

					element.on('click', function (event) {
						event.stopPropagation();
						event.preventDefault();

						if (scope.route) {
							scope.$apply(function () {
								controller.setRoute(scope.route);
							});
						}
					});

				}
			};
		}
	};

	return module;

})();