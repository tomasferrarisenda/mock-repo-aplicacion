/**
* @author: aminoldo
* @description: Logi Servie para Requisitos Administrativos
* @type: Service
**/
import * as angular from 'angular';
import {requisitoAdministrativoDto} from '../model/requisitoAdministrativoDto';

export interface IRequisitoAdministrativoLogicService {
    editRequisitoAdministrativo(idRequisito : number): angular.IPromise<any>;
}

class logicService implements IRequisitoAdministrativoLogicService {

    // #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */

    /**
    * @class NameLogicService
    * @constructor
    */
    constructor(private $log: ILogger, private $uibModal: any, private DateUtils: IDateUtils) {
        this.$log = this.$log.getInstance('RequisitoAdministrativoLogicService');
        this.$log.debug('ON');
    }

    // #endregion

    // #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

    editRequisitoAdministrativo(idRequisito: number) {
        return this.$uibModal.open({
            component: 'saRequisitosAdministrativosEdit',
            size: 'lg',
            resolve: {
                idRequisito: idRequisito
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

export class RequisitoAdministrativoLogicService {
    static init(ngModule: angular.IModule) {
        ngModule.factory('RequisitoAdministrativoLogicService', logicService.serviceFactory())
    }
}