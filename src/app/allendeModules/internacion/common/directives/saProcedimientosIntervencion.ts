/**
 * @author 			emansilla
 * @description 	description
 */
import * as angular from 'angular';
import procedimientosTemplate = require('../templates/sa-intervencion-procedimientos.tpl.html');
export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.directive('saProcedimientosIntervencion', saProcedimientosIntervencion);

		saProcedimientosIntervencion.$inject = ['$log', 'PracticaMedicaLogicService',
			'IntervencionLogicService', 'ModalService'];
		function saProcedimientosIntervencion ($log, PracticaMedicaLogicService,
			IntervencionLogicService, ModalService) {
			return {
				restrict : 'E',
				scope : {
					model : '=',
					title : '@?',

					required: '=?',

					// btnNewClick : '&?',
					btnNewDisabled : '=?',
					btnNewIf : '=?',

					origenMedico : '=?',
					origenAdministrativo : '=?',

					tipoInternacion : '=?',

					// btnDeleteClick : '&?',
					btnDeleteDisabled : '=?',
					btnDeleteIf : '=?'
				},
				template: procedimientosTemplate,
				link: link
			};

			function link (scope, element, attrs) {
				scope.sinDatos = 'Sin datos';
				scope.loading = false;
				scope.cantidadProcedimientos = 0;
				scope.action = '';

				scope.required = (angular.isUndefined(attrs.required) ? false : scope.required);
				scope.cantidadProcedimientosMin = (scope.required) ? 1 : 0;

				scope.btnNewClick = openPracticaMedicaSelector;
				// scope.btnEditClick = openEditProtesis;
				scope.btnDeleteClick = deletePracticaMedica;

				function openPracticaMedicaSelector () {
					scope.loading = true;
					var selector;

					if (scope.tipoPracticaMedica)
						selector = PracticaMedicaLogicService.openSelector({}, scope.tipoPracticaMedica);
					else 
						selector = PracticaMedicaLogicService.openSelectorQuirofano();

					selector.then(successCallback, errorCallback);

					function successCallback (pPracticaMedica) {
						scope.loading = false;
						IntervencionLogicService.addPracticaMedicaInDetalleIntervencion(pPracticaMedica, scope.model);
						// scope.cantidadProcedimientos += 1;
						changeForm();
					}

					function errorCallback (pError) {
						scope.loading = false;
					}
				}

				function deletePracticaMedica (pIndex) {
					var _nombrePractica;

					if (scope.model[pIndex].SubpracticaMedica) {
						_nombrePractica = scope.model[pIndex].SubpracticaMedica.nombre_subpractica_medica;
					} else {
						_nombrePractica = scope.model[pIndex].PracticaMedica.nombre_practica_medica;
					}

					ModalService.confirm('¿Desea quitar el elemento: ' + _nombrePractica +' ?',
						function (pResult) {
							if (pResult) {
								scope.model.splice(pIndex, 1);
								changeForm();
							}
						});
				}

				function changeForm () {
					scope.formProcedimientos.$pristine = false;
					if (scope.formProcedimientos.$$parentForm) {
						scope.formProcedimientos.$$parentForm.$pristine = false;

						if (scope.formProcedimientos.$$parentForm.$$parentForm)
							scope.formProcedimientos.$$parentForm.$$parentForm.$pristine = false;
					}
				}

				function getLengthByOrigen () {
					var length = 0;

					for (var i = 0; i < scope.model.length; i++) {
						if (scope.model[i].id_origen_practica != scope.origen)
							length++;
					}

					return length;
				}

				// Watch para cantidad de procedimientos
				scope.$watch(function () {
					
					if (scope.model && scope.model.length)
						return getLengthByOrigen();
					else 
						return 0;
				}, function (newVal) {
					scope.cantidadProcedimientos = newVal;
				});

				// Watch para tipo de practica médica
				scope.$watch(function () {
					if (scope.tipoInternacion && scope.tipoInternacion.TipoPracticaMedica)
						return scope.tipoInternacion.TipoPracticaMedica;
					else
						return '';
				}, function (newVal) {
					$log.debug('Cambio tipoInternacion');
					scope.tipoPracticaMedica = newVal;
				})

				activate();
				function activate () {
					setTimeout(function (){
						$log.debug('saProcedimientosIntervencion: activate ON.-', scope.model);

						if (scope.origenMedico) {
							scope.origen = 29; // Excluyo los origenes administrativos = 29
							if (scope.tipoInternacion) scope.tipoPracticaMedica = scope.tipoInternacion.TipoPracticaMedica;
						} else if (scope.origenAdministrativo) {
							scope.origen = 28; // Excluyo los origenes medico = 28
						} else {
							// Si no tiene ningún origen, dejo solo los administrativos
							scope.origen = 28; // Excluyo los origenes medico = 28
						}

					}, 1500);
				}
				
			}
		}
	}

	return module;

})();