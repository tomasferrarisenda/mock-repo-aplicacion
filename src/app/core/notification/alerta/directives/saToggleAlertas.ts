/**
 * @author:			Martin Astore
 * @description:	Directiva para ocultar alertas
 * @type:			Directive
 **/
export default (function () {
	'use strict';
	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.directive('saToggleAlertasClick', saToggleAlertasClick);

		saToggleAlertasClick.$inject = ['$log'];
		function saToggleAlertasClick ($log) {
			return {
				restrict : 'A',
				scope : {
					origen: '='
				},
				link: function (scope, element, attrs) {
					// $log.debug('elementDirective',element);
					var _options = {
						duration: 600,
						easing: 'swing'
					};
					// $log.debug('origenON',scope.origen);


					element.on('click', function (event) {
						if(scope.origen == "Usuario")
						{
							// $log.debug('origen',scope.origen);
							// $log.debug('clickSaToggleAlerta');
						   	$('#menuAlertasUsuario').stop(true,true).fadeToggle(_options);
						   	$('#botonAlertasUsuario').toggleClass('activo fa-user fa-user-o');
						   	$('#menuAlertasTitulo').stop(true,true).fadeOut(_options); 
						   	$('#botonAlertasTitulo').toggleClass('activo fa-exclamation-triangle', false);
						   	$('#botonAlertasTitulo').toggleClass('fa-exclamation-triangle', true);
						   	event.stopPropagation();
						}
						else
						{
						  	$('#menuAlertasTitulo').stop(true,true).fadeToggle(_options);
						   	$('#botonAlertasTitulo').toggleClass('activo fa-exclamation-triangle fa-exclamation-triangle');
						   	$('#menuAlertasUsuario').stop(true,true).fadeOut(_options); 
						   	$('#botonAlertasUsuario').toggleClass('activo fa-user', false);
						   	$('#botonAlertasUsuario').toggleClass('fa-user-o', true);
						   	event.stopPropagation();
						}
					});
				}
			};
		}

		ngModule.directive('saHideAlertasClick', saHideAlertasClick);

		saHideAlertasClick.$inject = ['$log', '$timeout'];
		function saHideAlertasClick ($log, $timeout) {
			return {
				restrict : 'A',
				link: function (scope, element, attrs) {
					// $log.debug('elementDirective',element);
					var _options = {
						duration: 600,
						easing: 'swing'
					};
					
					

					element.on('click', function (event) {
						// $log.debug('clickBodyDirective');
						hideAtivate();
					});
					function hideAtivate() {
						$('#menuAlertasUsuario').stop(true,true).fadeOut(_options); 
					   	$('#botonAlertasUsuario').toggleClass('activo fa-user', false);
					   	$('#botonAlertasUsuario').toggleClass('fa-user-o', true);
					   	$('#menuAlertasTitulo').stop(true,true).fadeOut(_options); 
					   	$('#botonAlertasTitulo').toggleClass('activo fa-exclamation-triangle', false);
					   	$('#botonAlertasTitulo').toggleClass('fa-exclamation-triangle', true);
					}
				}
			};
		}

		ngModule.directive('saUnchangeAlertasClick', saUnchangeAlertasClick);

		saUnchangeAlertasClick.$inject = ['$log'];
		function saUnchangeAlertasClick ($log) {
			return {
				restrict : 'A',
				scope : {
					origen: '='
				},
				link: function (scope, element, attrs) {
					// var $sidebarAndGrapper = getSideBarAndWrapper();
					// $(element).click(function(event) {
					// 	$log.debug('clickBodyDirective');
					//    $('#menuAlertas').hide(); 
					//    	event.stopPropagation();
					// });

					element.on('click', function (event) {
						// $log.debug('elementDirective',element);
						// $log.debug('clickBodyDirective');
					 	// $('#menuAlertas').hide(); 
					   	event.stopPropagation();
					});
				}
			};
		}
	};

	return module;

})();