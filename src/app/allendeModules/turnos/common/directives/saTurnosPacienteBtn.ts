/**
 * @author:			Pablo Pautasso
 * @description:	Directiva tipo btn donde levanta los turnos de un paciente especifico
 * @type:			Directive
 **/

import saTurnosPacienteBtnView = require('../templates/sa-turnos-paciente-btn.tpl.html');

export default (function () {
   'use strict';
   
	const module = { init : (ngModule: any) => {} };

	module.init = function(module) {

		module.directive('saTurnosPacienteBtn', saTurnosPacienteBtn );

		saTurnosPacienteBtn.$inject = ['$log', 'TurnosCommonLogicService'];

		function saTurnosPacienteBtn($log, TurnosCommonLogicService) {
			return {
				restrict: 'E',
				scope: {
					title: '@?',
					model: '=',
					esHistorico: '<',
					onReprogramar: '&?'
				},
				template: saTurnosPacienteBtnView,
				link: function(scope) {

					scope.sinDatos = 'Sin datos';
					
					scope.turnosPaciente = function () {
						TurnosCommonLogicService.openTurnosPaciente(scope.model, scope.esHistorico, false, true)
						.then(function (pResult) {
							if (pResult.accion === 'Reprogramar') scope.onReprogramar({idTurno:pResult.idTurno});

							$log.debug('result component turnos paciente',pResult);
						}, function (pError) {
							$log.error('result component turnos paciente',pError);
						});
					};

				}
			};
		}
	};

	return module;

})();