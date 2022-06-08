/**
 * @author:			Ezequiel Mansilla
 * @description:	Lógica de prótesis
 * @type:			Service
 **/
import protesisEditTemplate = require('../templates/protesis-view.tpl.html');
import protesisNewTemplate = require('../templates/protesis-new.tpl.html');
import protesisSelectTemplate = require('../templates/protesis-estado-select.tpl.html');
import protesisObservacionesTemplate = require('../templates/protesis-observaciones.tpl.html');
export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('ProtesisLogicService', ProtesisLogicService);

		ProtesisLogicService.$inject = ['$log', '$q', '$uibModal', 'ModalService', 
			'ProtesisDataService'];
		
		function ProtesisLogicService ($log, $q, $uibModal, ModalService,
			ProtesisDataService) {

			$log.debug('ProtesisLogicService: ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			const service = {
				newProtesis : newProtesis,
				openProtesis : openProtesis,
				removeProtesis : removeProtesis,
				showObservaciones : showObservacionesProtesis,

				editProtesis : editProtesis,
				registrarRecepcion : registrarRecepcion,
				registrarVerificacion : registrarVerificacion,
				registrarEsterilizacion : registrarEsterilizacion,
				registrarEntregaBanco : registrarEntregaBanco,
				
				esProveedorBancoInterno : esProveedorBancoInterno,
				crearProveedorPreadmision : crearProveedorPreadmision
			};

			return service;

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			/**
			 * Resuelve si el proveedor es de banco interno o no.
			 * @param  {ProveedorProtesisPreadmision} pProveedor [description]
			 * @return {true}            Es proveedor Banco Interno
			 * @return {false}           No es proveedor Banco Interno
			 */
			function esProveedorBancoInterno (pProveedor) {
				var _flag = false;

				if (pProveedor && pProveedor.nombre ==  'BANCO DE HUESOS') {
					_flag = true;
				}

				return _flag;
			}

			/* Dictionary */

			function createDictionaryRecepcionMaterial (pProtesis, pObservaciones, pUser) {
				var obj = {};
				obj['idProtesis'] = pProtesis.id_protesis_preadmision;
				obj['observaciones'] = pObservaciones;
				obj['idUser'] = pUser.id;
				return obj;
			}

			function createDictionaryEstadoMaterial (pProtesis, pObservaciones, pEstadoVeriicacion, pUser) {
				var obj = {};
				obj['idProtesis'] = pProtesis.id_protesis_preadmision;
				obj['idEstado'] = pEstadoVeriicacion.id;
				obj['observaciones'] = pObservaciones;
				obj['idUser'] = pUser.id;
				return obj;
			}

			function crearProveedorPreadmision (pNombre) {
				return {
					numpro: 0,
					nombre: pNombre
				};
			}

			/* Modals */

			function openProtesis (pProtesis) {

				return $uibModal.open({
					template: protesisEditTemplate,
					controller : 'ProtesisEditController',
					controllerAs : 'vm',
					size : 'lg',
					resolve : {
						Protesis : function () {
							return pProtesis;
						},
						Title : function () {
							return 'Editar prótesis/material';
						},
						Module : Module
					}
				}).result;
			}

			function newProtesis () {

				return $uibModal.open({
					template: protesisNewTemplate,
					controller : 'ProtesisEditController',
					controllerAs : 'vm',
					size : 'lg',
					resolve : {
						Protesis : function () {
							return null;
						},
						Title : function () {
							return 'Nueva prótesis/material';
						},
						Module : Module
					}
				}).result;
			}

			function removeProtesis (pIndex, pListProtesis) {
				var def = $q.defer(),
					nombreProtesis = pListProtesis[pIndex].nombre_protesis;

				ModalService.confirm('¿Desea quitar el elemento: '+ nombreProtesis +' ?',
					function (pResult) {
						if (pResult) {
							pListProtesis.splice(pIndex, 1);
							def.resolve('OK');
						} else {
							def.reject('ERROR');
						}
					});

				return def.promise;
			}

			function openSelectorEstadoProtesis (pProtesis, pUser, pEstado) {

				return $uibModal.open({
					template: protesisSelectTemplate,
					controller : 'ProtesisStateSelectorController',
					controllerAs : 'vm',
					size : 'lg',
					resolve : {
						Protesis : function () {
							return pProtesis;
						},
						Title : function () {
							return 'Verificar prótesis ' + pProtesis.nombre_protesis;
						},
						Estado : function () {
							return pEstado;
						},
						Module : Module,
						User : pUser
					}
				}).result;
			}

			function showObservacionesProtesis (pProtesis, pUser) {
				return $uibModal.open({
					template: protesisObservacionesTemplate,
					controller : 'ProtesisObservacionesModalController',
					controllerAs : 'vm',
					size : 'lg',
					resolve : {
						Protesis : function () {
							return pProtesis;
						},
						Title : function () {
							return 'Estados de prótesis ' + pProtesis.nombre_protesis;
						},
						Module : Module,
						User : pUser
					}
				}).result;
			}

			/* Lógica contra datos */

			function registrarRecepcion (pProtesis, pUser) {
				var def = $q.defer(),
					_message = 'Registrar recepción del material ' + pProtesis.nombre_protesis;

				ModalService.prompt(_message, '',
					function (pObservaciones) {
						if (pObservaciones) {
							var obj = createDictionaryRecepcionMaterial(pProtesis, pObservaciones, pUser);
							ProtesisDataService.registrarRecepcion(obj)
							.then(recepcionOk, errorCallback);
						}
					});

				function recepcionOk (pProtesisList) {
					def.resolve(pProtesisList);
				}
				function errorCallback (pError) {
					def.reject(pError);
				}

				return def.promise;
			}

			function registrarVerificacion (pProtesis, pUser) {
				var def = $q.defer();

				openSelectorEstadoProtesis(pProtesis, pUser, 'Verificacion')
				.then(registrarVerificacionOk, errorCallback);

				function registrarVerificacionOk (pResult) {
					var obj = createDictionaryEstadoMaterial(
						pProtesis,
						pResult.observaciones,
						pResult.estado,
						pUser);

					ProtesisDataService.registrarVerificacion(obj)
					.then(registrarOk, errorCallback);
				}

				function registrarOk (pProtesisList) {
					def.resolve(pProtesisList);
				}
				function errorCallback (pError) {
					def.reject(pError);
				}

				return def.promise;
			}

			function registrarEsterilizacion (pProtesis, pUser) {
				var def = $q.defer();
				
				openSelectorEstadoProtesis(pProtesis, pUser, 'Esterilizacion')
				.then(registrarEsterilizacionOk, errorCallback);

				function registrarEsterilizacionOk (pResult) {
					var obj = createDictionaryEstadoMaterial(
						pProtesis,
						pResult.observaciones,
						pResult.estado,
						pUser);

					ProtesisDataService.registrarEsterilizacion(obj)
					.then(esterilizarOk, errorCallback);
				}

				function esterilizarOk (pProtesisList) {
					def.resolve(pProtesisList);
				}

				function errorCallback (pError) {
					def.reject(pError);
				}

				return def.promise;
			}

			function registrarEntregaBanco (pProtesis, pUser) {
				var def = $q.defer();

				ModalService.prompt('Registrar entrega de Banco de huesos', pProtesis.observaciones_banco_huesos, 
					function (pObservaciones) {
						if (pObservaciones) {
							var obj = createDictionaryRecepcionMaterial(pProtesis, pObservaciones, pUser);
							ProtesisDataService.registrarEntregaBanco(obj)
							.then(entregarOk, errorCallback);
						}
					});

				function entregarOk (pProtesisList) {
					def.resolve(pProtesisList);
				}
				function errorCallback (pError) {
					def.reject(pError);
				}

				return def.promise;
			}

			function editProtesis (pProtesis, pUser) {
				var def = $q.defer();

				openProtesis(pProtesis)
				.then(editProtesisOk, errorCallback);

				function editProtesisOk (pProtesis) {
					pProtesis.id_usuario_modifica = pUser.id;
					ProtesisDataService.update(pProtesis)
					.then(updateOk, errorCallback);
				}

				function updateOk (pProtesisList) {
					def.resolve(pProtesisList);
				}

				function errorCallback (pError) {
					def.reject(pError);
				}

				return def.promise;
			}

			function Module () {
				return 'PRÓTESIS';
			}
			
		}
	};

	return module;

})();