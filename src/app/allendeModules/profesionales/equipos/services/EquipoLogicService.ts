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
 
		module.factory('EquipoLogicService', EquipoLogicService); 
		EquipoLogicService.$inject = ['Logger', '$uibModal', '$q', 'ModalService', 'EquiposDataService'];
 
		function EquipoLogicService($log, $uibModal, $q, ModalService, EquiposDataService) { 
			 $log = $log.getInstance('EquipoLogicService'); 
			 $log.debug('ON.-');
 
			 /* ------------------------------------------ API Y VARIABLES ------------------------------------------ */
 
			 const service = {
				editarConfiguracion : editarConfiguracion,
				guardarEquipo : guardarEquipo
			 };

			 function editarConfiguracion(idConfiguracionEdit, matriculaProfesional, idEquipo, idTipoEquipo) {
				return $uibModal.open({
					template: configuracionDefecto,
					controller: 'ConfiguracionDefectoEquipoTplController',
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
						idEquipo: function () {
							return idEquipo;
						},
						idTipoEquipo: function () {
							return idTipoEquipo;
						}
					}
				}).result;
			}

			// Centralizo el guardar equipos ya que se puede activar cuando se realiza uno nuevo, y se quiere agregar un profesional
			function guardarEquipo(equipoEdit){
				var def = $q.defer();

				var pregunta = equipoEdit.Id === 0 ? 'Debe guardar el equipo para continuar, ¿desea hacerlo?' : '¿Confirma guardar el equipo?';
				ModalService.confirm(pregunta,
				function(pResult) {
					if (pResult) {
						EquiposDataService.Guardar(equipoEdit)
						.then(function(result){
							if(result.IsOk === true){
								ModalService.success('Equipo guardado.');
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


