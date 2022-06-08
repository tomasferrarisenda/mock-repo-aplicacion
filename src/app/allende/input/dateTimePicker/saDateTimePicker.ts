/**
 * @author:			Martin Astore
 * @description:	Componente input para carga de Fecha y Hora
 * @type:			Directive
 **/
import * as angular from 'angular';
import dateTimePickerTemplate = require("./sa-date-time-picker.tpl.html");

export default (function () {
	'use strict';
	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.directive('saDateTimePicker', saDateTimePicker);

		saDateTimePicker.$inject = ['$log', '$timeout', '$rootScope'];
		function saDateTimePicker($log, $timeout, $rootScope) {
			return {
				restrict : 'E',
				require: '?ngModel',
				scope : {
					type: '@',
					ngDisabled : '=?', // Bool
					min : '=?', 	// Date
					max : '=?',		// Date
					required : '<?', // Bool
					id : '=?',
					minutos : '=?',
					startAt : '=?'
				},
				template : dateTimePickerTemplate,
				link: link
			};

			function link (scope, element, attrs, controller: angular.INgModelController) {
				// $log.debug('saDateTimePicker linked', scope.id);

				if (!controller) return;

				$timeout(activate);
				
				scope.renderOnBeforeRender = renderOnBeforeRender;
				scope.clickCalendar = clickCalendar;
				scope.timePicked = timePicked;
				scope.updateModel = updateModel;
				scope.formatoFecha = 'DD/MM/YYYY';
				
				/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

				function clickCalendar() {
					setType();
				}

				function renderOnBeforeRender($dates) {

					scope.dates = $dates;
					updateDates();
			
				}

				function setType() {
					
					switch (scope.type) {
						case 'date':
							scope.config.startView = 'day';
							scope.config.minView = 'day';
							scope.formatoFecha = 'DD/MM/YYYY';
							break;
						case 'time':
							scope.config.startView = 'hour';
							scope.config.minView = 'minute';
							scope.formatoFecha = 'HH:mm';
							break;
						case 'datetime-local':
							scope.config.startView = 'day';
							scope.config.minView = 'minute';
							scope.formatoFecha = 'DD/MM/YYYY HH:mm';
							break;
						
					}
					rerenderPicker();
				}

				function rerenderPicker() {
					$rootScope.$broadcast("updateConfigSaDateTimePicker" + scope.id);
					// $rootScope.$broadcast("updateRenderSaDateTimePicker");
				}
				
				function timePicked() {
					
					// $('.dropdown-menu').toggle();
						if($('.dropdown'+scope.id+'-parent').hasClass( "open" ))
							$('.dropdown'+scope.id+'-parent').toggleClass( "open" );
		
				}

				function updateModel(newValue) {
					
					if (newValue) {
						controller.$setViewValue(newValue);
					}
				}
				
				function updateDates() {
					
					if(scope.dates){
						angular.forEach(scope.dates, function (date,key) {
							//consulto si existe min y max para setear rango elegible
							if (scope.min){
								
								if (new Date(date.utcDateValue) < scope.min.getTime())
								date.selectable = false;
							}
							if(scope.max){
								
								if (new Date(date.utcDateValue) > scope.max.getTime())
								date.selectable = false;
							}
						});
					}
				}
				
				function updateDirective(value) {
					if(value)
					scope.model = value;
				}
				
				/* ----------------------------------------------- WATCHS ----------------------------------------------- */

				scope.$watch(function () {
					return scope.model;
				}, updateModel, true);
				
				scope.$watch(function () {
					return scope.min;
				}, updateDates);

				scope.$watch(function () {
					return scope.max;
				}, updateDates);

				/* For model */
				scope.$watch(function () {
						return controller.$modelValue || controller.$viewValue;
				}, updateDirective);

				//watch for type
				// scope.$watch(function() {
				// 	return scope.type;
				// }, function (value) {
				// 	if(value)
				// 		setType();
				// });

				//watch for disabled
				scope.$watch(function() {
					return scope.ngDisabled;
				}, function (value) {
					scope.disabled = value;
				});


				/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */

				function activate() {
					scope.nombre = attrs.name;

					scope.max = (!angular.isUndefined(attrs.max)) ? scope.max : null;
					scope.min = (!angular.isUndefined(attrs.min)) ? scope.min : null;
					scope.required = (!angular.isUndefined(attrs.required)) ? scope.required : false;
					scope.disabled = (!angular.isUndefined(attrs.disabled)) ? scope.disabled : false;
					scope.id = (!angular.isUndefined(attrs.id)) ? scope.id : 1;
					scope.minutos = (!angular.isUndefined(attrs.minutos)) ? scope.minutos : 5;
					scope.startAt = (!angular.isUndefined(attrs.startAt)) ? scope.startAt : 'day';
					

					scope.anioMax = new Date().getFullYear() + 100;
					scope.fechaMax = '12/31/' + scope.anioMax;
					scope.maxDateCommon = new Date(scope.fechaMax);
					scope.minDateCommon = new Date('01/01/1900');
					scope.today = scope.today ? null : new Date();


					//opciones para la directiva datetimepicker
					scope.config = {
						dropdownSelector: '#datetimepicker' + scope.id,
						minuteStep: scope.minutos,
						minView: 'minute',
						startView: 'day',
						configureOn: 'updateConfigSaDateTimePicker' + scope.id,
						// renderOn: 'updateRenderSaDateTimePicker'
					};
					//configuramos la vista inicial si es que existe
					scope.config.startView = (!angular.isUndefined(attrs.startView)) ? attrs.startView : scope.config.startView;
					setType();
					scope.ready = true;
				}
			}
		}
	};

	return module;
})();