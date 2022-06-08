/**
 * @author:			Martin Astore
 * @description:	Menu de Alertas
 * @type:			Directive
 **/
import * as angular from 'angular';
import saMenuAlertasTemplate = require('../templates/sa-menu-alertas.tpl.html');
import { ICredentialsDataService } from 'core/security';

export default (function () {
	'use strict';

	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.directive('saMenuAlertas', saMenuAlertas);

		saMenuAlertas.$inject = ['$log', 'AlertaService', 'AlertaDataService', 'TIPOS_ALERTA',
		'StorageService', 'CredentialsDataService', 'ENV'];
		function saMenuAlertas ($log, AlertaService, AlertaDataService, TIPOS_ALERTA,
			StorageService, CredentialsDataService: ICredentialsDataService, ENV) {

			return {
				restrict : 'E',
				scope : {
					origen: '=',
					alertas: '='
				},
				template : saMenuAlertasTemplate,
				link: link,
				controller: MenuAlertaController
			};

			function link (scope, attrs, element) {

				/* ----------------------------------------- API Y VARIABLES ----------------------------------------- */
				// $log.debug('origen',scope.origen);
				scope.data = {
					alertas: []
				};
				scope.tiposAlerta = TIPOS_ALERTA;
				
				scope.cantidadAlertas = 0;
				// scope.verMenu = verMenu;
				scope.mostrarMenu = false;
				scope.close = close;
				// scope.alertaLeida = alertaLeida;
				// scope.alertaNoLeida = alertaNoLeida;

				

				/* ----------------------------------------- IMPLEMENTACION ----------------------------------------- */

				function registrarAlerta() {
					var cantidadAlertas = 0;
					scope.data.alertas = (scope.origen === "Usuario") ? AlertaDataService.alertasUsuario: AlertaDataService.alertasTitulo;
					if(scope.data.alertas)
						for (var i = scope.data.alertas.length - 1; i >= 0; i--) {
							if(!scope.data.alertas[i].leido) {
								$log.debug('_cantidadAlertas',cantidadAlertas);
								cantidadAlertas = cantidadAlertas + 1;
							}
							
						}
					scope.cantidadAlertas = cantidadAlertas;
					setearColor();
				}

				function setearColor() {
					if(scope.origen == "Titulo")
					{
						scope.clases = "fa-exclamation-triangle btn btn-default";
						if(scope.cantidadAlertas !== 0)
						{
							var hayCritica = false;
							var hayAlta = false;
							var hayMedia = false;
							for (var i = scope.data.alertas.length - 1; i >= 0; i--) {
								switch (scope.data.alertas[i].idCriticidad)
									{
										case 1:
											hayCritica = true;
											break;	
										case 2:
											hayAlta = true;
											break;
										case 3:
											hayMedia = true;
											break;
										default:
											break;
									}
							}
							if(hayMedia && !hayAlta && !hayCritica)
								scope.clases = scope.clases + " btn-media";
							if(hayAlta && !hayCritica)
								scope.clases = scope.clases + " btn-alta";
							if(hayCritica)
								scope.clases = scope.clases + " btn-critica";
						}
					}
				}

				function GetAlertas() {
					if(scope.alertas && scope.alertas.length > 0)
					{
						var alertas = angular.copy(scope.alertas);
						for (var i = alertas.length - 1; i >= 0; i--) {
							if(!alertas[i].TiposOrigen) alertas[i].TiposOrigen = [];
							if(!alertas[i].TiposAlerta) alertas[i].TiposAlerta = [];
						}
						AlertaService.GetAlertasByEntidad(alertas);
					}
				}
					

				function close() {
					AlertaService.CloseAll();
				}

				// function alertaLeida(Alerta) {
				// 	AlertaDataService.AlertaLeida(Alerta);
				// }

				// function alertaNoLeida(Alerta) {
				// 	AlertaDataService.AlertaNoLeida(Alerta);
				// }


 				// scope.$watch(function () {
 				// 	return AlertaDataService.update;
 				// }, function(newValue, oldValue) {
 				// 	if(newValue)
 				// 	{
 				// 		$log.debug('menualertas$watch.update');
 				// 		registrarAlerta();
 				// 		// AlertaDataService.update = false;
 				// 	}
 				// });

 				scope.$watch(function () {
 					return scope.data.alertas;
 				}, function(newValue, oldValue) {
 					if(newValue)
 					{
 						// $log.debug('menualertas$watch.alertas');
 						registrarAlerta();
 					}
 				},true);

 				scope.$watch(function () {
 					return scope.alertas;
 				}, function(newValue, oldValue) {
 					if(newValue)
 					{
 						// $log.debug('menualertas$watch.alertas');
 						GetAlertas();
 					}
 				},true);



				// $('body').click(function(event) {
				// 	$log.debug('clickBody');
				// 	// hideMenu();
				// 	// scope.$apply();
				//    $('#menuAlertas').hide(); 
				//    	event.stopPropagation();
				// });

				// $('#menuAlertas').click(function(event){
				//      event.stopPropagation();
				//     // scope.mostrarMenu = true;
				//      $log.debug('clickAlertas');
				// });

				// $('#botonAlertas').click(function(event){
				// 	// $timeout($('#menuAlertas').toggle(), 250);
				//     $('#menuAlertas').toggle();
				//     // toggleMenu();
				//     $log.debug('clickBoton');
				//     event.stopPropagation();
				// });

				/* -------------------------------------------- ACTIVATE -------------------------------------------- */
				
				activate();

				function activate() {
					
					scope.classHeader = ENV.CLASS;
					if (scope.classHeader == 'production') { 
						scope.whiteClass = true;
					}

					if(scope.origen == "Usuario")
					{
						scope.data.alertas = AlertaDataService.alertasUsuario;
						if (scope.whiteClass) { 
							scope.clases = "fa-user-o fa-2x btn-white-toolbar";
						}else scope.clases = "fa-user-o fa-2x";
						var alertas = StorageService.get('sa-alertas-activas');
						if(alertas){
							// $log.debug('alertasStorageGet',alertas);
							for (var i = alertas.length - 1; i >= 0; i--) {
								if(alertas[i].toastId != "0")
									AlertaService.AddToAlertasUsuario(alertas[i]);
							}
						}
						CredentialsDataService.Get()
							.then(function (user) {
								if(user)
									AlertaService.GetTimeout();
							});
					}
					else if(scope.origen == "Titulo")
					{
						scope.data.alertas = AlertaDataService.alertasTitulo;
						if (scope.whiteClass) { 
							scope.clases = "fa-exclamation-triangle btn btn-default btn-white-toolbar";
						}else scope.clases = "fa-exclamation-triangle btn btn-default";
						
					}

					// $('#menuAlertasTitulo').hide();
					// $('#menuAlertasUsuario').hide(); 
					// $('#menuAlertas{{origen}}').hide();
					
					registrarAlerta();
					$log.debug('saMenuAlertas ON');
					// GetAlertas();
				}

			}
		}
		MenuAlertaController.$inject = ['$scope', 'AlertaDataService'];
		function MenuAlertaController(scope, AlertaDataService) {

			var vm = this;

			vm.alertaLeida = alertaLeida;
			vm.alertaNoLeida = alertaNoLeida;

			function alertaLeida(Alerta) {
				AlertaDataService.AlertaLeida(Alerta);
			}

			function alertaNoLeida(Alerta) {
				AlertaDataService.AlertaNoLeida(Alerta);
			}
		}
	};

	return module;

})();