/**
 * @author:			Ezequiel Mansilla
 * @description:	Componente input para carga de horas
 * @type:			Directive
 **/
import * as angular from 'angular';
import './saTimePicker.scss';
import timePickerTemplate = require("../templates/sa-time-picker.tpl.html");
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.directive('saTimePicker', saTimePicker);

		saTimePicker.$inject = ['$log'];
		function saTimePicker ($log) {
			return {
				restrict : 'E',
				scope : {
					model : '=',	// Date
					disabled : '=?', // Bool
					min : '=?', 	// Date
					max : '=?',		// Date
					required : '=?' // Bool
				},
				template : timePickerTemplate,
				link: link
			};

			function link (scope, element, attrs) {
				var name = (!angular.isUndefined(attrs.name)) ? attrs.name : '';

				if (name) $('#txt_hora_minuto').attr("name", attrs.name);

				scope.max = (!angular.isUndefined(attrs.max)) ? scope.max : null;
				scope.required = (!angular.isUndefined(attrs.required)) ? scope.required : false;
				scope.disabled = (!angular.isUndefined(attrs.disabled)) ? scope.disabled : false;

				scope.updateModel = updateModel;
				scope.isDate = isDate;

				function updateModel () {
					var hora = scope.hora || 0,
						minuto = scope.minuto || 0;

					validarFecha();

					scope.model.setHours(hora);
					scope.model.setMinutes(minuto);
					//$log.debug('Model', scope.model);
				}

				function isDate () {
					return Date.parse(scope.model);
				}

				function updateHoraMinutoFromModel (pModel) {

					if (isDate()) {
						scope.hora = pModel.getHours();
						scope.minuto = pModel.getMinutes();
					} else {
						scope.hora = '';
						scope.minuto = '';
					}
				}

				function validarFecha () {
					if (!isDate()) {
						//$log.debug('No era fecha ', scope.model);
						scope.model = new Date();
						//$log.debug('Ahora si es fecha ', scope.model);
					} else {
						scope.requiredOk = validarRequired();
						scope.minOk = validarMin();
						scope.maxOk = validarMax();

						// scope.formSaTimePicker.$valid = (scope.requiredOk && scope.minOk && scope.maxOk);
						scope.formSaTimePicker.$$parentForm.$valid = (scope.requiredOk && scope.minOk && scope.maxOk);
						// scope.formSaTimePicker.$invalid = !(scope.requiredOk && scope.minOk && scope.maxOk);
					}
				}

				function validarMin () {
					if (!scope.min) return true;
					return scope.min <= scope.model;
				}

				function validarMax () {
					if (!scope.max) return true;
					return scope.max >= scope.model;
				}

				function validarRequired () {
					if (!scope.required) return true;
					return (scope.model) ? true : false;
				}

				/* For model */
				scope.$watch(function () {
					return scope.model || '';
				}, updateHoraMinutoFromModel);
			}
		}
	};

	return module;
	
})();