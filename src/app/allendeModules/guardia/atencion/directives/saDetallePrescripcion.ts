/**
 * @author:			Martin Astore
 * @description:	Detalle de prescripcion
 * @type:			Directive
 **/

import detallePrescripcion = require('../templates/detalle-prescripcion.tpl.html');

export default (function () {
	'use strict';
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.directive('saDetallePrescripcion', saDetallePrescripcion);

		saDetallePrescripcion.$inject = ['$log', '$q', 'GuardiaAtencionLogicService'];
		function saDetallePrescripcion ($log, $q, GuardiaAtencionLogicService) {
			return {
				restrict : 'E',
				scope : {
					// model : '=', // UbicacionEntity,
					prescripcion : '<',
					// changed : '&',
					esEnfermeria : '<?',
					realizar : '&?',
					limpiar : '='
				},
				template : detallePrescripcion,
				link: link
			};

			function link (scope) {

				/* ----------------------------------------- API Y VARIABLES ----------------------------------------- */

				scope.data = {
					
				};

				scope.piso = {};
				scope.verMedicamentos = verMedicamentos;
				scope.colorearPrioridad = colorearPrioridad;

				/* ----------------------------------------- IMPLEMENTACION ----------------------------------------- */

				function verMedicamentos (pIndex) {
					var estado = scope.prescripcion.Detalles[pIndex].verMateriales;
					for (var i = 0; i < scope.prescripcion.Detalles.length; i++) {
						scope.prescripcion.Detalles[i].verMateriales = false;
					}

					scope.prescripcion.Detalles[pIndex].verMateriales = !estado;

					if(scope.prescripcion.Detalles[pIndex].Materiales.length == 0)
						scope.prescripcion.Detalles[pIndex].noMateriales = true;
 				}


 				function colorearPrioridad(pPrioridad) {
					return GuardiaAtencionLogicService.colorearPrioridad(pPrioridad);
				}

 			// 	scope.$watch(scope.limpiar, function (newVal, oldVal) {
				// 	if (oldVal && !newVal) {
				// 		limpiar();
				// 	}
				// });

 				scope.$watch(function () {
 					return scope.limpiar;
 				}, function(newValue) {
 					if (newValue)
 					{
 						activate();
 						scope.limpiar = false;
 					}
 				});

 				scope.$watch(function () {
 					return scope.prescripcion;
 				}, function(newValue) {
 					if (newValue)
 					{
 						activate();
 					}
 				},true);



				/* -------------------------------------------- ACTIVATE -------------------------------------------- */
				
				activate();

				function activate () {
 					$log.debug('saDetallePrescripcion activate');

					if(scope.prescripcion)
 					{
	 					for (var i = 0; i < scope.prescripcion.Detalles.length; i++) {
							// datosIndicacion(scope.prescripcion.Detalles[i].Indicacion,i);
							if(scope.prescripcion.Detalles[i].ObservacionMedica && 
								scope.prescripcion.Detalles[i].ObservacionMedica != '')
							{
								scope.prescripcion.Detalles[i].observacionMedica = true;
							}
							if(scope.prescripcion.Detalles[i].ObservacionEnfermeria != '' && 
								scope.prescripcion.Detalles[i].ObservacionEnfermeria != null)
							{
								scope.prescripcion.Detalles[i].observacionEnfermeria = true;
							}
							for (var j = 0; j < scope.prescripcion.Detalles[i].Materiales.length; j++) {
								if(scope.prescripcion.Detalles[i].Materiales[j].Dosis == 0)
									scope.prescripcion.Detalles[i].Materiales[j].Dosis = "";
							}
						}
						if(!scope.prescripcion.Detalles || scope.prescripcion.Detalles.length == 0)
						{
							scope.vacio = true;
						}
 					}
				}
			}
		}
	};

	return module;
})();