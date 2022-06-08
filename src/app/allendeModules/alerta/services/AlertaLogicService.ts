/**
 * @author:			Martin Astore
 * @description:	Alertas
 * @type:			Servicio Logic de alerta
 **/

import destinatariosTemplate = require('../templates/destinatarios-alerta-list.tpl.html');
import alertaNewTemplate = require('../templates/alerta-new.tpl.html');

export default (function () {
	'use strict';

	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.factory('AlertaLogicService', AlertaLogicService);
		AlertaLogicService.$inject = ['$log', '$uibModal'];
		function AlertaLogicService($log, $uibModal) {
			$log.info('AlertaLogicService: ON.-');

			// API o Interface
			const service = {
				VerDestinatarios: VerDestinatarios,
				NewAlerta: NewAlerta
			};

			function VerDestinatarios(pAlerta) {
				var _modalInstance;

				_modalInstance = $uibModal.open({
					template: destinatariosTemplate,
					controller: 'DestinatariosAlertaListController',
					controllerAs: 'vm',
					size: 'md',
					resolve: {
						Alerta: function () {
							return pAlerta;
						}
					}
				});

				return _modalInstance.result;
			}

			function NewAlerta(pEntidad) {
				var _modalInstance;

				_modalInstance = $uibModal.open({
					template: alertaNewTemplate,
					controller: 'AlertaNewController',
					controllerAs: 'vm',
					size: 'lg',
					resolve: {
						Entidad: function () {
							return pEntidad;
						}
					}
				});

				return _modalInstance.result;
			}

			return service;
		}
	};

	return module;
})();