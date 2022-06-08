/**
* @author: ppautasso
* @description: authservice para reprogramacion de turnos
* @type: Service
**/
import * as angular from 'angular';
import { IAuthorizationService } from '../../../../core/security/services/AuthorizationService';

export interface IReprogramacionTurnosAuthService {
    puedeReprogramar(pUser: any): any;
}

class logicService implements IReprogramacionTurnosAuthService {

    // #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */

    /**
    * @class ReprogramacionTurnosAuthService
    * @constructor
    */
    constructor(
        private $log: ILogger, 
        private $uibModal: any, 
        private DateUtils: IDateUtils, 
        private AuthorizationService: IAuthorizationService,
        private PERMISSION_LIST
    ) {
        this.$log = this.$log.getInstance('ReprogramacionTurnosAuthService');
        this.$log.debug('ON');
    }

    // #endregion

    // #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

    puedeReprogramar(pUser) {
        return this.AuthorizationService.tienePermisoById(pUser, this.PERMISSION_LIST.REPROGRAMACION);
    }

    static serviceFactory() {
        const service = (log, uibModal, dateUtils, AuthorizationService, PERMISSION_LIST) => new logicService(log, uibModal, dateUtils, AuthorizationService, PERMISSION_LIST);
        service.$inject = ['Logger', '$uibModal', 'DateUtils', 'AuthorizationService', 'PERMISSION_REPROGRAMACION_TURNOS'];
        return service
    }

    // #endregion
}

export class ReprogramacionTurnosAuthService {
    static init(ngModule: angular.IModule) {
        ngModule.factory('ReprogramacionTurnosAuthService', logicService.serviceFactory())
    }
}