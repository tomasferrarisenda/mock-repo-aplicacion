
export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('SociedadProfesionalesLogicService', SociedadProfesionalesLogicService);

		SociedadProfesionalesLogicService.$inject = ['$log', '$uibModal', 'ModalService', 'SociedadProfesionalesDataService', '$q', 'DateUtils'];

		function SociedadProfesionalesLogicService ($log, $uibModal, ModalService, SociedadProfesionalesDataService, $q, DateUtils) {
			
			const service = {
				guardarSociedad : guardarSociedad
			};
			return service;

			// Centralizo el guardar sociedad de profesionales, ya que se puede activar cuando se realiza una nueva, y se va hacia la solapa documentos
			function guardarSociedad(editSociedad, fechaIncorporacion){
				var def = $q.defer();
				editSociedad.FechaIncorporacion = DateUtils.parseToBe(fechaIncorporacion);
				
				var pregunta = '¿Confirma guardar la sociedad?';
				ModalService.confirm(pregunta,
				function(pResult) {
					if (pResult) {
						SociedadProfesionalesDataService.guardarSociedad(editSociedad)
						.then(function(result){
							if(result.IsOk === true){
								ModalService.success('Sociedad guardada.');
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
		}
	};

	return module;

})();