/**
* @author: crusso
* @description: Concepto Ajuste
* @type: Service
**/
import * as angular from 'angular';

export interface IConceptoAjusteLogicService {
    editarConceptoAjuste(id: number): any;
}

class logicService implements IConceptoAjusteLogicService {
 
    // #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */

    /**
    * @class ConceptoAjusteLogicService
    * @constructor
    */
    constructor(private $log: ILogger, private $uibModal: any, private DateUtils: IDateUtils) {
        this.$log = this.$log.getInstance('ConceptoAjusteLogicService');
        this.$log.debug('ON');
    }

    // #endregion

    // #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

    editarConceptoAjuste(idConceptoAjuste) {
        return this.$uibModal.open({
            component: 'saConceptoAjusteEdit',
            size: 'lg',
            keyboard: true,
            resolve: {
                idConceptoAjuste: function () {
                    return idConceptoAjuste;
                },
            }
        }).result;
    }

    method() {
        // body
    }

    static serviceFactory() {
        const service = (log, uibModal, dateUtils) => new logicService(log, uibModal, dateUtils);
        service.$inject = ['Logger', '$uibModal', 'DateUtils'];
        return service
    }

    // #endregion
}



export class ConceptoAjusteLogicService {
    static init(ngModule: angular.IModule) {
        ngModule.factory('ConceptoAjusteLogicService', logicService.serviceFactory())
    }
}