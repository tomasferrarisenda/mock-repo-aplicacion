/**
* @author: aminoldo
* @description: Plantilla de Texto
* @type: Service
**/
import * as angular from 'angular';
import { plantillaTextoDto } from '../model/plantillaTextoDto';

export interface IPlantillaTextoLogicService {
    editPlanillaTexto(propositoEdit: any): angular.IPromise<any>;
}

class logicService implements IPlantillaTextoLogicService {

    // #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */

    /**
    * @class NameLogicService
    * @constructor
    */
    constructor(private $log: ILogger, private $uibModal: any, private DateUtils: IDateUtils) {
        this.$log = this.$log.getInstance('PlantillaTextoLogicService');
        this.$log.debug('ON');
    }

    // #endregion

    // #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

    editPlanillaTexto(propositoEdit: any) {
        return this.$uibModal.open({
            component: 'saPlantillaTextoEdit',
            size: 'lg',
            resolve: {
                propositoEdit: propositoEdit
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

export class PlantillaTextoLogicService {
    static init(ngModule: angular.IModule) {
        ngModule.factory('PlantillaTextoLogicService', logicService.serviceFactory())
    }
}