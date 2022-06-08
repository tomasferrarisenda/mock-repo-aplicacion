/**
 * @author:			Martin Astore
 * @description:	Alertas
 * @type:			Directive
 **/ 
import saAlertaTemplate = require("../templates/sa-alerta.tpl.html");

export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.directive('saAlerta', saAlerta);

		saAlerta.$inject = ['$log', 'AlertaDataService', 'toaster', 'TIPOS_ALERTA'];
		function saAlerta ($log, AlertaDataService, toaster, TIPOS_ALERTA) : any {

			return {
				restrict : 'E',
				scope : {

				},
				template: saAlertaTemplate,
				link: link
			};

			function link (scope, attrs, element) {

				/* ----------------------------------------- API Y VARIABLES ----------------------------------------- */

				scope.data = {
					alertas: AlertaDataService.alertas,
					pop : AlertaDataService.pop
				};
				scope.tiposAlerta = TIPOS_ALERTA;


				/* ----------------------------------------- IMPLEMENTACION ----------------------------------------- */


				// function updateDirective () {
				// 	scope.data.alertas = AlertaService.alertas;
				// }

				function pop1() {
					// toaster.pop('success', "title", '<ul><li>Render html</li></ul>', 5000, 'trustedHtml');
					for (var i = AlertaDataService.alertas.length - 1; i >= 0; i--) {
						if(!AlertaDataService.alertas[i].leido)
							toaster.pop(AlertaDataService.alertas[i]);
					}
					AlertaDataService.alertas = [];

					// toaster.pop({
					//             title: 'A toast',
					// 		    body: 'with an onShow callback',
					// 			onShowCallback: function () { 
					// 			    toaster.pop({
					// 			        title: 'A toast',
					// 				    body: 'invoked as an onShow callback'
					// 				});
					// 			}
					// });
					// toaster.pop({
					//             title: 'A toast',
					// 		    body: 'with an onHide callback',
					// 			onHideCallback: function () { 
					// 			    toaster.pop({
					// 			        title: 'A toast',
					// 				    body: 'invoked as an onHide callback'
					// 				});
					// 			}
					// });

				}

				function close() {
					toaster.clear(1);
				}


 				// scope.$watch(function () {
 				// 	return AlertaService.alertas;
 				// }, function(newValue, oldValue) {
 				// 	if (newValue != oldValue)
 				// 	{
 				// 		updateDirective();
 				// 	}
 				// });

 				scope.$watch(function () {
 					return AlertaDataService.pop;
 				}, function(newValue, oldValue) {
 					if(newValue)
 					{
 						$log.debug('alerta$watch');
 						pop1();
 						AlertaDataService.pop = false;
 					}
 				});

 				scope.$watch(function () {
 					return AlertaDataService.close;
 				}, function(newValue, oldValue) {
 					if(newValue)
 					{
 						$log.debug('alerta$watch');
 						close();
 						AlertaDataService.close = false;
 					}
 				});



				/* -------------------------------------------- ACTIVATE -------------------------------------------- */
				
				// activate();

				// function activate () {
				// 	angular.copy(scope.data.pop, AlertaService.pop);
				// 	$log.debug('saAlerta ON');
				// }
			}
		}
	};

	return module;

})();