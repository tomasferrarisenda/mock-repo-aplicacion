import segurosDelProfesional = require('../templates/seguros.tpl.html');
import { IProfesionalesDataService } from '../services';
import configuracionDefecto = require('../templates/configuracionDefecto.tpl.html');

export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('ProfesionalesLogicService', ProfesionalesLogicService);

		ProfesionalesLogicService.$inject = ['$log', '$uibModal', 'ModalService',
			'ProfesionalesDataService', '$q', 'DateUtils'];

		function ProfesionalesLogicService ($log, $uibModal, ModalService,
			ProfesionalesDataService: IProfesionalesDataService, $q, DateUtils) {
			
			const service = {
				guardarProfesional : guardarProfesional,
				editarSeguro : editarSeguro,
				editarConfiguracion : editarConfiguracion
			};
			return service;

			function editarSeguro(id, idProfesional) {
				return $uibModal.open({
					template: segurosDelProfesional,
					controller: 'SegurosTplController',
					keyboard : true,
					controllerAs: 'vm',
					size: 'lg',
					resolve: {
						idSeguroEdit: function () {
							return id;
						},
						idProfesionalEdit: function () {
							return idProfesional;
						}
					}
				}).result;
			}

			// Centralizo el guardar profesionales, ya que se puede activar cuando se realiza uno nuevo, y se va hacia la solapa documentos
			function guardarProfesional(editProfesional){
				var def = $q.defer();

				var pregunta = '¿Confirma guardar el profesional?';
				ModalService.confirm(pregunta,
				function(pResult) {
					if (pResult) {
						ProfesionalesDataService.guardarProfesional(editProfesional)
						.then(function(result){
							if(result.IsOk === true){
								ModalService.success('Profesional guardado.');
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

			function editarConfiguracion(idConfiguracionEdit, matriculaProfesional, idProfesional, idTipoProfesional) {
				return $uibModal.open({
					template: configuracionDefecto,
					controller: 'ConfiguracionProfesionalDefectoTplController',
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
						idProfesional: function () {
							return idProfesional;
						},
						idTipoProfesional: function () {
							return idTipoProfesional;
						}
					}
				}).result;
			}
		}
	};

	return module;

})();