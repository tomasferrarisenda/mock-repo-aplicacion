/**
* @author: ppautasso
* @description: data service para tipo deposito
* @type: Service
**/
import * as angular from 'angular';
import { IDtoService } from 'core/http';

export interface ITipoDepositoDataService {
    getAll(): angular.IPromise<any>;
    getOne(id: number): angular.IPromise<any>;
    obtenerTodos(): angular.IPromise<any>;
}

class dataService implements ITipoDepositoDataService {

    // #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */

    /**
    * @class TipoDepositoDataService
    * @constructor
    */
    constructor(private $log: ILogger, private DtoService: IDtoService) {
        this.$log = this.$log.getInstance('TipoDepositoDataService');
        this.$log.debug('ON');
    }

    // #endregion

    // #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

    getAll() {
        let url = 'Stock2/Depositos/TipoDeposito/';
        return this.DtoService.Get(url, { isCachable: true });
    }

    getOne(id) {
        let url = `Stock2/Depositos/TipoDeposito/${id}`;
        return this.DtoService.Get(url);
    }

    obtenerTodos() {
        let url = `Stock2/Depositos/TipoDeposito/ObtenerTodos`;
        return this.DtoService.Get(url);
    }

    static serviceFactory() {
        const service = (log, dtoService) => new dataService(log, dtoService);
        service.$inject = ['Logger', 'DtoService'];
        return service;
    }
    // #endregion
}

export class TipoDepositoDataService {
    static init(ngModule: angular.IModule) {
        ngModule.factory('TipoDepositoDataService', dataService.serviceFactory())
    }
}