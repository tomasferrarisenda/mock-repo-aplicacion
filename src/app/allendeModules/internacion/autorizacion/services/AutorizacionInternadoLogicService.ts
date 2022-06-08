/**
 * @author:			Ezequiel Mansilla
 * @description:	Lógica de Autorizaciones de internado.
 * @type:			Service
 **/
import * as angular from 'angular';
import autorizacionPrintTemplate = require('../templates/autorizacion-print.tpl.html');
export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('AutorizacionInternadoLogicService', AutorizacionInternadoLogicService);

		AutorizacionInternadoLogicService.$inject = ['Logger', 'DateUtils', '$uibModal'];
		
		function AutorizacionInternadoLogicService ($log, DateUtils, $uibModal) {

			$log = $log.getInstance('AutorizacionInternadoLogicService');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			const service = {
				// print : print,
				// printOrdenInternacion : printOrdenInternacion, 
				// printMateriales : printMateriales,
				// printRp :  printRp,
				printAll : printAll,
				crearIntervencionAdmision : crearIntervencionAdmision,
				precargarAutorizacionFromInternacion : precargarAutorizacionFromInternacion
			};

			return service;

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			function precargarAutorizacionFromInternacion (pAutorizacion, pInternacion) {
				$log.warn('Depreco');
				var autorizacion = pAutorizacion;

				autorizacion.id_internacion = pInternacion.id_internacion;
				autorizacion.Mutual = pInternacion.Mutual;
				autorizacion.nombre_plan_mutual = pInternacion.nombre_plan_mutual;
				autorizacion.numero_afiliado = pInternacion.numero_afiliado;
				autorizacion.TipoAfiliado = pInternacion.TipoAfiliado;
				autorizacion.EnfermedadCie = pInternacion.EnfermedadCie;
				autorizacion.diagnostico = pInternacion.diagnostico;
				if (pInternacion.MedicoCabecera)
					autorizacion.MedicoCabecera = pInternacion.MedicoCabecera;
				else if (pInternacion.MedicoSolicitante)
					autorizacion.MedicoCabecera = pInternacion.MedicoSolicitante;

				return autorizacion;
			}

			function crearIntervencionAdmision (pIntervencion, pFormData, pUser) {
				var _intervencion : any = {};

				angular.copy(pIntervencion, _intervencion);

				_intervencion.fecha_autorizado = DateUtils.parseToBe(pFormData.fechaAutorizacion);

				if (_intervencion.Mutual) {
					_intervencion.Mutual.TipoAfiliado = null;
					if (!_intervencion.Mutual.trabaja_plan)
						_intervencion.nombre_plan_mutual = '';
				}

				if (_intervencion.TipoAfiliado) {
					_intervencion.id_tipo_afiliado =_intervencion.TipoAfiliado.Id;
				 	_intervencion.TipoAfiliado= null;
				}
				_intervencion.usuario_modifica = pUser.userName.substring(0,30);

				return _intervencion;
			}

			/* PRINT */
			function print (pIdInternacion, pIdAutorizacion, pTitle, pUser) {
				return $uibModal.open({
					template: autorizacionPrintTemplate,
					controller: 'AutorizacionInternadoPrintController',
					controllerAs : 'vm',
					size: 'lg',
					resolve: {
						Title : function () {
							return pTitle;
						},
						User : function () {
							return pUser;
						},
						IdInternacion : function () {
							return pIdInternacion;
						},
						IdIntervencionAdmision : function () {
							return pIdAutorizacion;
						}
					}
				}).result;
			}

			function printOrdenInternacion (pIdInternacion, pIdAutorizacion, pUser) {
				return print(pIdInternacion, pIdAutorizacion, 'ORDEN DE INTERNACIÓN', pUser);
			}

			function printMateriales (pIdInternacion, pIdAutorizacion, pUser) {
				return print(pIdInternacion, pIdAutorizacion, 'Pedido de Materiales', pUser);
			}

			function printRp (pIdInternacion, pIdAutorizacion, pUser) {
				return print(pIdInternacion, pIdAutorizacion, 'RP', pUser);
			}

			function printAll (pIdInternacion, pIdAutorizacion, pUser) {
				printOrdenInternacion(pIdInternacion, pIdAutorizacion, pUser)
				.then(function () {}, function () {
					
					printMateriales(pIdInternacion, pIdAutorizacion, pUser)
					.then(function () {}, function () {
						printRp(pIdInternacion, pIdAutorizacion, pUser);
					});
				});
			}
			
		}
	};

	return module;

})();