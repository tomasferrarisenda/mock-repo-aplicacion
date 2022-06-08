/**
* @author: pferrer
* @description: Ambito Data
* @type: Service
**/
import * as angular from 'angular';
import { IDtoService } from 'core/http';
import { AmbitoDto } from './../../models';

export interface IAmbitoDataService {
    getAll(): angular.IPromise<AmbitoDto>;
    getOne(id: number): angular.IPromise<AmbitoDto>;
}

class dataService implements IAmbitoDataService {

    // #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */

    /**
    * @class AmbitoDataService
    * @constructor
    */
    constructor(private $log: ILogger, private DtoService: IDtoService) {
        this.$log = this.$log.getInstance('AmbitoDataService');
        this.$log.debug('ON');
    }

    // #endregion

    // #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

    getAll() {
        let url = 'Ambitos/ObtenerTodos';
        return this.DtoService.Get(url);
    }

    getOne(id) {
        let url = `Ambitos/ObtenerPorId/${id}`;
        return this.DtoService.Get(url);
    }

    static serviceFactory() {
        const service = (log, dtoService) => new dataService(log, dtoService);
        service.$inject = ['Logger', 'DtoService'];
        return service;
    }
    // #endregion
}

export class AmbitoDataService {
    static init(ngModule: angular.IModule) {
        ngModule.factory('AmbitoDataService', dataService.serviceFactory())
    }
}