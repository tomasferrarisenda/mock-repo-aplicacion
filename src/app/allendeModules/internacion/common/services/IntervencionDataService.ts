/**
 * @author:			emansilla
 * @description:	Acceso a datos contra back-end.
 * @type:			Service
 **/
export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('IntervencionDataService', IntervencionDataService);

		IntervencionDataService.$inject = ['DotService', 'Logger'];
		
		function IntervencionDataService (DotService, $log) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('IntervencionDataService');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */
			
			/* jshint ignore:start */

			var Id;

			/* jshint ignore:end */

			const service = {
				GetAll : GetAll,
				GetOne : GetOne,
				Add : Add,
				Update : Update,
				New : New,
				GetInternacion : GetInternacion,

				estaAutorizada : estaAutorizada
			};

			return service;

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			function GetAll () {
				var _url = 'legacy/IntervencionAdmision';
				return DotService.Get(_url);
			}

			function GetOne (pId) {
				var _url = 'legacy/IntervencionAdmision/' + pId;
				return DotService.Get(_url);
			}

			function Add (pIntervencion) {
				var _url = 'legacy/IntervencionAdmision/';
				return DotService.Post(_url, pIntervencion);
			}

			function Update (pIntervencion) {
				var _url = 'legacy/IntervencionAdmision/Update';
				return DotService.Post(_url, pIntervencion);
			}

			function New (pIdInternacion) {
				var _url = 'legacy/IntervencionAdmision/New/' + pIdInternacion;
				return DotService.Get(_url);
			}

			function GetInternacion(pIdInternacion) {
				var _url = 'legacy/Internacion/ByIntervencion/' + pIdInternacion;
				return DotService.Get(_url);
			}

			function estaAutorizada (pId) {
				var _url = 'legacy/IntervencionAdmision/EsAutorizada/' + pId;
				return DotService.Get(_url);
			}

		}
	};

	return module;

})();