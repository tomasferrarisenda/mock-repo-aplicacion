/**
* @author: ppautasso
* @description: data service para tipo stockeable
* @type: Service
**/
import * as angular from 'angular';
import { IDtoService } from 'core/http';

export interface ITipoStockeableDataService {
    getAll(): angular.IPromise<any>;
    getOne(id: number): angular.IPromise<any>;
    obtenerTodos(): angular.IPromise<any>;
}

class dataService implements ITipoStockeableDataService {

    // #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */

    /**
    * @class TipoStockeableDataService
    * @constructor
    */
    constructor(private $log: ILogger, private DtoService: IDtoService) {
        this.$log = this.$log.getInstance('TipoStockeableDataService');
        this.$log.debug('ON');
    }

    // #endregion

    // #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

    getAll() {
        let url = 'Stock2/Depositos/TipoStockeable/';
        return this.DtoService.Get(url);
    }

    getOne(id) {
        let url = `Stock2/Depositos/TipoStockeable/${id}`;
        return this.DtoService.Get(url);
    }

    obtenerTodos(){
        let url = `Stock2/Depositos/TipoStockeable/ObtenerTodos`;
        return this.DtoService.Get(url);
    }

    static serviceFactory() {
        const service = (log, dtoService) => new dataService(log, dtoService);
        service.$inject = ['Logger', 'DtoService'];
        return service;
    }
    // #endregion
}

export class TipoStockeableDataService {
    static init(ngModule: angular.IModule) {
        ngModule.factory('TipoStockeableDataService', dataService.serviceFactory())
    }
}