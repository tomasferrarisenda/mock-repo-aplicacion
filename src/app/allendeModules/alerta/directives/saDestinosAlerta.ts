/**
 * @author:			mastore
 * @description:	Destinos Alertas
 * @type:			Directive
 **/
import * as angular from 'angular';
import destinoTemplate = require('../templates/sa-destinos-alerta.html');

export default (function () {
	'use strict';
	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.directive('saDestinosAlerta', saDestinosAlerta);

		saDestinosAlerta.$inject = ['$log', '$q', 'AlertaDataService'];
		function saDestinosAlerta($log, $q, AlertaDataService) {
			return {
				restrict: 'E',
				// require: '?ngModel',
				scope: {
					loading: '=?',
					idDestino: '=?',
					tipoDestino: '=?',
					ngDisabled: '=?',
					clean: '&?'
				},
				template: destinoTemplate,
				link: link
			};

			function link(scope, attrs, element) {

				// if (!controller) return;
				/* ----------------------------------------- API Y VARIABLES ----------------------------------------- */

				scope.data = {
					tiposDestino: []
				};

				scope.formData = {
					tipoDestino: {
						paciente: false,
						usuario: false,
						rol: false
					},
					rol: '',
					idDestino: ''
				};

				scope.required = (attrs.ngRequired || attrs.required) ? true : false;
				scope.disabled = (angular.isUndefined(attrs.ngDisabled)) ? false : scope.ngDisabled;
				scope.loading = (angular.isUndefined(attrs.loading)) ? false : scope.loading;

				scope.cambioPaciente = cambioPaciente;
				scope.cambioRol = cambioRol;
				scope.cambioUsuario = cambioUsuario;

				scope.selectTipoDestino = selectTipoDestino;

				scope.required = (attrs.ngRequired || attrs.required) ? true : false;
				scope.disabled = (angular.isUndefined(attrs.ngDisabled)) ? false : scope.ngDisabled;
				scope.loading = (angular.isUndefined(attrs.loading)) ? false : scope.loading;

				// scope.limpiarDatos = limpiarDatos;

				/* ----------------------------------------- IMPLEMENTACION ----------------------------------------- */

				function limpiar() {

				}

				function selectTipoDestino() {
					$log.debug('selectTipoDestino', scope.tipoDestino);
					// scope.tipoDestino = scope.tipoDestino;
					scope.idDestino = 0;
					scope.formData.tipoDestino.paciente = false;
					scope.formData.tipoDestino.rol = false;
					scope.formData.tipoDestino.usuario = false;
					if (scope.tipoDestino && scope.tipoDestino !== '') {
						if (!scope.tipoDestino.EsTipo) {
							switch (scope.tipoDestino.Id) {
								case 1:
									scope.formData.tipoDestino.paciente = true;
									break;
							}
						}
						else {
							switch (scope.tipoDestino.Id) {
								case 2:
									scope.formData.tipoDestino.rol = true;
									break;
								case 1:
									scope.formData.tipoDestino.usuario = true;
									break;
							}
						}
					}
				}

				function cambioPaciente() {
					scope.idDestino = scope.formData.idPaciente;
					$log.debug('scope.idDestino', scope.idDestino);
				}

				function cambioRol() {
					scope.idDestino = scope.formData.idRol;
					$log.debug('scope.idDestino', scope.idDestino);
				}

				function cambioUsuario() {
					scope.idDestino = scope.formData.idUsuario;
					$log.debug('scope.idDestino', scope.idDestino);
				}

				scope.$watch(function () {
					return scope.tipoDestino;
				}, function (newValue) {
					$log.debug('tipoDestino watcg', newValue);
					// scope.tipoDestino = newValue;
					selectTipoDestino();
				});

				/* -------------------------------------------- ACTIVATE -------------------------------------------- */

				activate();

				function activate() {
					var tiposDestino = AlertaDataService.GetTiposDestino();

					$q.all([tiposDestino])
						.then(activateOk, activateError);
				}

				function activateOk(results) {
					$log.debug('saDestinosAlerta activateOK', results);
					scope.data.tiposDestino = results[0];
				}

				function activateError(pError) {
				}
			}
		}
	};

	return module;
})();