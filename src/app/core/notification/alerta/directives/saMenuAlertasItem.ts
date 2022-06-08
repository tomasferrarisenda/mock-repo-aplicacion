/**
 * @author:			Martin Astore
 * @description:	Menu de Alertas
 * @type:			Directive
 **/ 
import saMenuAlertasItemTemplate = require("../templates/sa-menu-alertas-item.tpl.html");
import "./saMenuAlertasItem.scss";

export default (function () {
	'use strict';
	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.directive('saMenuAlertasItem', saMenuAlertasItem);

		saMenuAlertasItem.$inject = ['$log'];
		function saMenuAlertasItem ($log) : any{

			return {
				restrict : 'E',
				require : '^saMenuAlertas',
				scope:{
					alerta: '='
				},
				template : saMenuAlertasItemTemplate,
				link : link
			};
			function link(scope, element, attrs, controller) {
				scope.alertaLeida = controller.alertaLeida;
				scope.alertaNoLeida = controller.alertaNoLeida;
			}

			
		}
	};

	return module;

})();