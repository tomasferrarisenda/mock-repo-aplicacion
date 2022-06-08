/**
* @author: 
* @description: modalservice para revaluacion
* @type: Service
**/
import * as angular from 'angular';
import loadingProgressTemplate = require('../components/revaluacionLoadingProgressComponent/RevaluacionLoadingProgressComponent.html')

export interface IRevaluacionModalService {
    openLoadingProgress(tamaño:number): any;
}

class logicService implements IRevaluacionModalService {

    // #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */

    /**
    * @class RevaluacionModalService
    * @constructor
    */
    constructor(private $log: ILogger, private $uibModal: any, private DateUtils: IDateUtils) {
        this.$log = this.$log.getInstance('RevaluacionModalService');
        this.$log.debug('ON');
    }

    // #endregion

    // #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */
    public openLoadingProgress(tamaño) {
        return this.$uibModal.open({
			component: 'saRevaluacionLoadingProgress',
			size: 'lg',
            backdrop  : 'static',
            keyboard  : false,
			resolve: {
				Tamaño: function () {
					return tamaño;
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

export class RevaluacionModalService {
    static init(ngModule: angular.IModule) {
        ngModule.factory('RevaluacionModalService', logicService.serviceFactory())
    }
}