/**
* @author: crusso
* @description: Corte Facturacion Logic Service
* @type: Service
**/
import * as angular from 'angular';

export interface ICorteFacturacionLogicService {
    editarCorteFacturacion(mes: number): any;
}

class logicService implements ICorteFacturacionLogicService {

    // #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */

    /**
    * @class CorteFacturacionLogicService
    * @constructor
    */
    constructor(private $log: ILogger, private $uibModal: any, private DateUtils: IDateUtils) {
        this.$log = this.$log.getInstance('CorteFacturacionLogicService');
        this.$log.debug('ON');
    }

    // #endregion

    // #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */
    editarCorteFacturacion(idCorteFacturacion : number) {
        return this.$uibModal.open({
            component: 'saCorteFacturacionEdit',
            size: 'md',
            keyboard: true,
            resolve: {
                idCorteFacturacion: function () {
                    return idCorteFacturacion; //Ayuda al Profesor //
                },
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

export class CorteFacturacionLogicService {
    static init(ngModule: angular.IModule) {
        ngModule.factory('CorteFacturacionLogicService', logicService.serviceFactory())
    }
}