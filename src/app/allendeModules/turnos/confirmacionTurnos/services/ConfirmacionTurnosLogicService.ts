/**
* @author: ppautasso
* @description: service logic para el modlo de confirmacion de turnos
* @type: Service
**/
import * as angular from 'angular';

export interface IConfirmacionTurnosLogicService {
	openVerExcepcionesConfirmacion(pIdProgramacion: number): any;
	openVerComunicacionesDelTurno(pTurno: any): any;
}

class logicService implements IConfirmacionTurnosLogicService {

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */

	/**
	* @class ConfirmacionTurnosLogicService
	* @constructor
	*/
	constructor(private $log: ILogger, private $uibModal: any, private DateUtils: IDateUtils) {
		this.$log = this.$log.getInstance('ConfirmacionTurnosLogicService');
		this.$log.debug('ON');
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

	openVerExcepcionesConfirmacion(pIdProgramacion: number) {
		return this.$uibModal.open({
            component: 'saVerExcepcionesPorProgramacionModal',
            size: 'lg',
            resolve: {
                IdProgramacion: pIdProgramacion
            }
        }).result;
	}


	openVerComunicacionesDelTurno(pTurno: any) {
		return this.$uibModal.open({
            component: 'saVerComunicacionesDelTurnoModal',
            size: 'lg',
            resolve: {
                Turno: pTurno
            }
        }).result;
	}

	static serviceFactory() {
		const service = (log, uibModal, dateUtils) => new logicService(log, uibModal, dateUtils);
		service.$inject = ['Logger', '$uibModal', 'DateUtils'];
		return service
	}

	// #endregion
}

export class ConfirmacionTurnosLogicService {
	static init(ngModule: angular.IModule) {
		ngModule.factory('ConfirmacionTurnosLogicService', logicService.serviceFactory())
	}
}