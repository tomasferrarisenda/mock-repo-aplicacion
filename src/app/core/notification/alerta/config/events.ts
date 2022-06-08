/**
 * @author:			Ezequiel Mansilla
 * @description:	Run
 * @type:			Controller
 **/
export default (function () {
	'use strict';

	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.run(run);

		run.$inject = ['Logger', '$rootScope', '$injector'];

		function run ($log, $rootScope, $injector) {

			$log = $log.getInstance('AlertaEvents');
			$log.debug('ON');

			$rootScope.$on('alertaLeida', alertaLeida);
			$rootScope.$on('alertaNoLeida', alertaNoLeida);

			function alertaLeida(event, pAlerta) {
				$log.debug('alertaleida', pAlerta);
				var AlertaDataService = $injector.get('AlertaDataService');
				var StorageService = $injector.get('StorageService');
				// if(pAlerta.esDeUsuario)
					for (var i = AlertaDataService.alertasUsuario.length - 1; i >= 0; i--) {
						if(AlertaDataService.alertasUsuario[i].toastId == pAlerta.toastId && 
							AlertaDataService.alertasUsuario[i].body == pAlerta.body)
						{
							AlertaDataService.alertasUsuario[i].leido = true;
							$log.debug('marca como leida');
							StorageService.set('sa-alertas-activas', AlertaDataService.alertasUsuario);
						}
					}
				// else if(!pAlerta.esDeUsuario)
					for (var i = AlertaDataService.alertasTitulo.length - 1; i >= 0; i--) {
						if(AlertaDataService.alertasTitulo[i].toastId == pAlerta.toastId && 
							AlertaDataService.alertasTitulo[i].body == pAlerta.body)
						{

							AlertaDataService.alertasTitulo[i].leido = true;
						}
					}
			}

			function alertaNoLeida(event, pAlerta) {
				$log.debug('alertaleida', pAlerta);
				var AlertaDataService = $injector.get('AlertaDataService');
				var StorageService = $injector.get('StorageService');			
				// if(pAlerta.esDeUsuario)
					for (var i = AlertaDataService.alertasUsuario.length - 1; i >= 0; i--) {
						if(AlertaDataService.alertasUsuario[i].toastId == pAlerta.toastId && 
							AlertaDataService.alertasUsuario[i].body == pAlerta.body)
						{
							$log.debug('marca como no leida');
							AlertaDataService.alertasUsuario[i].leido = false;
							StorageService.set('sa-alertas-activas', AlertaDataService.alertasUsuario);
						}
					}
				// if(!pAlerta.esDeUsuario)
					for (var i = AlertaDataService.alertasTitulo.length - 1; i >= 0; i--) {
						if(AlertaDataService.alertasTitulo[i].toastId == pAlerta.toastId && 
							AlertaDataService.alertasTitulo[i].body == pAlerta.body)
						{
							AlertaDataService.alertasTitulo[i].leido = false;
						}
					}
			}
		}
	};

	return module;
})();