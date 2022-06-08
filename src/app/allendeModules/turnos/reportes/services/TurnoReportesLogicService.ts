/**
* @author: crusso
* @description: Logicca de informes de turnos
* @type: Service
**/
import * as angular from 'angular';

export interface ITurnoReportesLogicService {
	getBuscarStatus(servicio, tipoTurno, prestacionesObtenidas, afiliaciones, sucursal): any;
}

class logicService implements ITurnoReportesLogicService {

	constructor(private $log: ILogger, private $uibModal: any, private DateUtils: IDateUtils, private AlertaService: IAlertaService) {
		this.$log = this.$log.getInstance('TurnoInformeLogicService');
		this.$log.debug('ON');
	}

	getBuscarStatus(servicio, tipoTurno, prestacionesObtenidas, afiliaciones, sucursal) {

		var ret = true;
		let strAlerta = '';
		//controlo paciente y sus afiliaciones

		if (afiliaciones && afiliaciones.length > 0) {

			

				if (!servicio) {
					ret = false;
					strAlerta = strAlerta + " - Falta seleccionar el Servicio."
				}
				if (!tipoTurno || !tipoTurno.hasOwnProperty('Id')) {
					ret = false;
					strAlerta = strAlerta + " - Falta seleccionar el Tipo de Turno."
				}
				if (!prestacionesObtenidas) {
					strAlerta = strAlerta + " - Falta seleccionar alguna Prestacion."
					ret = false;
				} else {
					var prestacionOk = false;
					angular.forEach(prestacionesObtenidas, function (prestacion) {
						if (prestacion.status === true) {
							prestacionOk = true;
						}

					});
					if (!prestacionOk) {
						ret = false;
						strAlerta = strAlerta + " - Falta seleccionar una Prestación."
					}
				}
				if (!sucursal) {
					ret = false;
					strAlerta = strAlerta + " - Falta seleccionar una Sucursal."
				}

			
		}else {
			ret = false;
			strAlerta = strAlerta + " - Falta seleccionar alguna mutual."
		}


		if (strAlerta.length > 1) this.AlertaService.NewWarning("Atencion", strAlerta);

		return ret;
	}

	static serviceFactory(log, uibModal, dateUtils, AlertaService) {
		return new logicService(log, uibModal, dateUtils, AlertaService);
	}
}
logicService.serviceFactory.$inject = ['Logger', '$uibModal', 'DateUtils', 'AlertaService'];

export class TurnoReportesLogicService {
	static init(ngModule: angular.IModule) {
		ngModule.factory('TurnoReportesLogicService', logicService.serviceFactory)
	}
}