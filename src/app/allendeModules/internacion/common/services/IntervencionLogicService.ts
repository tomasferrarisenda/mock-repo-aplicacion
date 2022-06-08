/**
 * @author:			Ezequiel Mansilla
 * @description:	Lógica para intervención admision
 * @type:			Service
 **/
export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('IntervencionLogicService', IntervencionLogicService);

		IntervencionLogicService.$inject = ['$log'];
		
		function IntervencionLogicService ($log) {

			$log.debug('IntervencionLogicService: ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			const service = {
				addPracticaMedicaInDetalleIntervencion : addPracticaMedicaInDetalleIntervencion
			};

			return service;

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			function addPracticaMedicaInDetalleIntervencion (pPracticaMedica, pDetalleIntervencionList) {
				$log.debug('AddPracticaMedica ON.-');
				var _flag, _detalle;

				_flag = true;
				// Se quita validación de existencia de practica
				// for (var i = 0; i < pDetalleIntervencionList.length; i++) {
				// 	if (pDetalleIntervencionList[i].SubpracticaMedica) 
				// 	{
				// 		if (pDetalleIntervencionList[i].SubpracticaMedica.codigo_subpractica_medica == 
				// 				pPracticaMedica.codigo_practica_medica) {
				// 			ModalService.warning('Ya agregó esta práctica.');
				// 			_flag = false;
				// 			break;
				// 		}
				// 	} else if (pDetalleIntervencionList[i].PracticaMedica.codigo_practica_medica == 
				// 			pPracticaMedica.codigo_practica_medica) {
				// 		ModalService.warning('Ya agregó esta práctica.');
				// 		_flag = false;
				// 		break;
				// 	}
				// };

				if (_flag) {

					if (pPracticaMedica.esSubPractica) {
						_detalle = {
							SubpracticaMedica : pPracticaMedica,
							id_subpractica_medica : pPracticaMedica.id_subpractica_medica,
							id_practica_medica : pPracticaMedica.id_practica_medica,
						};
					} else {
						_detalle = {
							PracticaMedica : pPracticaMedica
						};
					}

					pDetalleIntervencionList.push(_detalle);
					$log.debug('AddPracticaMedica OK.-', _detalle);
				}

				return _flag;
			}
			
		}
	};

	return module;

})();