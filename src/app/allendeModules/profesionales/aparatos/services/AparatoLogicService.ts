/**
 * @author:			Pablo Pautasso
 * @description:	
 * @type:			Service
 **/

import configuracionDefecto = require('../templates/configuracionDefecto.tpl.html');
export default (function () {
	'use strict';
	 
	 const module = { init : (ngModule: any) => {} };
 
	 module.init = function(module) {
 
		module.factory('AparatoLogicService', AparatoLogicService); 
		AparatoLogicService.$inject = ['Logger', '$uibModal', '$q', 'ModalService', 'AparatosDataService'];
 
		function AparatoLogicService($log, $uibModal, $q, ModalService, AparatosDataService) { 
			 $log = $log.getInstance('AparatoLogicService'); 
			 $log.debug('ON.-');
 
			 /* ------------------------------------------ API Y VARIABLES ------------------------------------------ */
 
			 const service = {
				editarConfiguracion : editarConfiguracion,
				guardarAparato : guardarAparato
			 };

			 function editarConfiguracion(idConfiguracionEdit, matriculaProfesional, idAparato, idTipoAparato) {
				return $uibModal.open({
					template: configuracionDefecto,
					controller: 'ConfiguracionDefectoAparatoTplController',
					keyboard : true,
					controllerAs: 'vm',
					size: 'lg',
					resolve: {
						idConfiguracionEdit: function () {
							return idConfiguracionEdit;
						},
						matriculaProfesional: function () {
							return matriculaProfesional;
						},
						idAparato: function () {
							return idAparato;
						},
						idTipoAparato: function () {
							return idTipoAparato;
						}
					}
				}).result;
			}

			// Centralizo el guardar aparatos, ya que se puede activar cuando se realiza uno nuevo, y se va a la solapa de Documentos
			function guardarAparato(aparatoEdit){
				var def = $q.defer();

				var pregunta = aparatoEdit.Id === 0 ? 'Debe guardar el aparato para continuar, ¿desea hacerlo?' : '¿Confirma guardar el aparato?';
				ModalService.confirm(pregunta,
				function(pResult) {
					if (pResult) {
						AparatosDataService.Guardar(aparatoEdit)
						.then(function(result){
							if(result.IsOk === true){
								ModalService.success('Aparato guardado.');
								def.resolve(result);
							}
							else{
								ModalService.warning('Verifique por favor. ' + result.Message);
								def.reject(result);
							}
						})
						.catch(function (pError) {
							ModalService.error(pError.message);
							def.reject(pError);
						});
					} else{
						def.reject('cancel');
					}
				});
				return def.promise;
			}

			 return service;
		}

	}

	return module;
})();


