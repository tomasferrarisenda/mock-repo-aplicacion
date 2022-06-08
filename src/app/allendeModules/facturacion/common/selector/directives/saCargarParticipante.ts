/**
 * @author:			Pedro Ferrer
 * @description:	Carga de participante
 * @type:			Directive
 **/
import * as angular from 'angular';
import cargarParticipanteTemplate = require('../templates/sa-Cargar-Participante.tpl.html');
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.directive('saCargarParticipante', saCargarParticipante);

		saCargarParticipante.$inject = ['$log', 'ModalService', 'ParticipanteDataService', 'PrefacturaAmbulatorioDataService', 'TIPO_PARTICIPANTE'];
		function saCargarParticipante ($log, ModalService, ParticipanteDataService, PrefacturaAmbulatorioDataService, TIPO_PARTICIPANTE) {
			return {
				restrict : 'E',
				scope : {
					model : '=?',
					listaParticipantes : '<?',
					listaComponentes : '<?',
					limiteParticipantes : '<?',
					idItem : '<?',
					mostrarNuevoParticipante : '=?',
					editable : '<?'
				},
				template: cargarParticipanteTemplate,
				link: link
			};

			function link(scope){
				scope.cargarParticipanteNuevo = cargarParticipanteNuevo;
				scope.focoAgregarParticipante = focoAgregarParticipante;

				scope.filter = {
					tipoComponenteElegido : '',
					listaComponentes : '',
					participante : '',
					deshabilitarProfesional : false
				};

				scope.$watch(function () {
					return scope.mostrarNuevoParticipante;
				}, function(){
					if(scope.mostrarNuevoParticipante){
						var listaComponentes = angular.copy(scope.listaComponentes);
						for (var j = 0; j < scope.listaParticipantes.length; j++) { 
							for (let i = 0, cantidad = listaComponentes.length; i < cantidad; i++) {
								if (scope.listaParticipantes[j].IdTipoComponente === listaComponentes[i].Id) {
									listaComponentes.splice(i, 1);
									cantidad = listaComponentes.length;
									break;
								}
							}
						}
						scope.filter.listaComponentes = listaComponentes;
						if(scope.filter.listaComponentes) scope.filter.tipoComponenteElegido = scope.filter.listaComponentes[0];
					}
					else
					{
						scope.filter.participante=null;
					}
				});

				scope.$watch(function () {
					return scope.filter.tipoComponenteElegido;
				}, function(){
					if (scope.filter.tipoComponenteElegido){
						switch (scope.filter.tipoComponenteElegido.Id){
							case TIPO_PARTICIPANTE.DERECHOS:
								scope.filter.participante = null;
								scope.filter.deshabilitarProfesional = true;
							break;
							default:
								scope.filter.deshabilitarProfesional = false;
							break;
						}
					}
				});

				function cargarParticipanteNuevo(){
					focoAgregarParticipante();
					var idProfesional;
					switch (scope.filter.tipoComponenteElegido.Id){
						case TIPO_PARTICIPANTE.DERECHOS:
							idProfesional = 0;
						break;
						default:
							idProfesional = scope.filter.participante.IdProfesional;
						break;
					}

					PrefacturaAmbulatorioDataService.obtenerNuevoParticipanteItemPrefactura(scope.idItem, idProfesional, scope.filter.tipoComponenteElegido.Id)
					.then(function(participante){
						scope.model = participante;
						scope.mostrarNuevoParticipante = false;
					});
				}

				function focoAgregarParticipante(){
					$("#btnAgregarParticipante").focus();
				}
			}
		}
	};
	return module;

})();