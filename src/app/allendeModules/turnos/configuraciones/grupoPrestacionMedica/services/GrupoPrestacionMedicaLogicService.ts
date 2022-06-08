/**
* @author: pferrer
* @description: Logic de Grupo Prestacion Medica
* @type: Service
**/
import * as angular from 'angular';
import { GrupoPrestacionMedicaEditDto } from '../model/grupoPrestacionMedicaEditDto';

export interface IGrupoPrestacionMedicaLogicService {
    editGrupoPrestacion(idGrupo : number, idServicio : number): angular.IPromise<GrupoPrestacionMedicaEditDto>;
}

class logicService implements IGrupoPrestacionMedicaLogicService {

    // #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */

    /**
    * @class NameLogicService
    * @constructor
    */
    constructor(private $log: ILogger, private $uibModal: any, private DateUtils: IDateUtils) {
        this.$log = this.$log.getInstance('IGrupoPrestacionMedicaLogicService');
        this.$log.debug('ON');
    }

    // #endregion

    // #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

    editGrupoPrestacion(idGrupo: number, idServicio: number) {
        return this.$uibModal.open({
            component: 'saGrupoPrestacionMedicaEdit',
            size: 'lg',
            resolve: {
                idGrupo: idGrupo,
                idServicio : idServicio
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

export class GrupoPrestacionMedicaLogicService {
    static init(ngModule: angular.IModule) {
        ngModule.factory('GrupoPrestacionMedicaLogicService', logicService.serviceFactory())
    }
}