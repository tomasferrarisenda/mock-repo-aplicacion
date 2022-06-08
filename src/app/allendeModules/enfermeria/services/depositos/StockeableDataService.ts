/**
* @author: ppautasso
* @description: data service para stockeable
* @type: Service
**/
import * as angular from 'angular';
import { IDtoService } from 'core/http';

import {FiltroStockeable} from '../../../enfermeria/models'

export interface IStockeableDataService {
    getAll(): angular.IPromise<any>;
    getOne(id: number): angular.IPromise<any>;
    obtenerTodosPorTipo(pIdTipo: number): angular.IPromise<any>;
    obtenerPorFiltro(pFiltroStockeable: FiltroStockeable): angular.IPromise<any>;
    obtenerPorFiltroGrilla(pFiltroStockeable: FiltroStockeable): angular.IPromise<any>;
    obtenerPorId(pIdTipo: number, pIdStockeable: number): angular.IPromise<any>;
    obtenerPorIdConStock(pIdTipo: number, pIdStockeable: number, pIdSucursal: number): angular.IPromise<any>;
    obtenerPorTipoYCodigo(pIdTipo: number, pCodigoStockeable: number): angular.IPromise<any>;
    obtenerTodosPorCodigoYNombre(filtro: any): angular.IPromise<any>;
    
}

class dataService implements IStockeableDataService {

    // #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */

    /**
    * @class StockeableDataService
    * @constructor
    */
    constructor(private $log: ILogger, private DtoService: IDtoService) {
        this.$log = this.$log.getInstance('StockeableDataService');
        this.$log.debug('ON');
    }

    // #endregion

    // #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

    getAll() {
        let url = 'Stock2/Depositos/Stockeable/';
        return this.DtoService.Get(url);
    }

    getOne(id) {
        let url = `Stock2/Depositos/Stockeable/${id}`;
        return this.DtoService.Get(url);
    }

    obtenerTodosPorTipo(pIdTipo){
        let url = `Stock2/Depositos/Stockeable/ObtenerTodosPorTipo/${pIdTipo}`;
        return this.DtoService.Get(url);
    }

    obtenerPorFiltro(pFiltroStockeable: FiltroStockeable){
        let url = `Stock2/Depositos/Stockeable/ObtenerPorFiltro/`;
        return this.DtoService.Post(url, pFiltroStockeable);
    }

    obtenerPorFiltroGrilla(pFiltroStockeable: FiltroStockeable){
        let url = `Stock2/Depositos/Stockeable/ObtenerPorFiltroGrilla/`;
        return this.DtoService.Post(url, pFiltroStockeable);
    }

    obtenerPorId(pIdTipo: number, pIdStockeable: number){
        let url = `Stock2/Depositos/Stockeable/ObtenerPorId/${pIdTipo}/${pIdStockeable}`;
        return this.DtoService.Get(url);
    }

    obtenerPorIdConStock(pIdTipo: number, pIdStockeable: number, pIdSucursal: number){
        let url = `Stock2/Depositos/Stockeable/ObtenerPorId/${pIdTipo}/${pIdStockeable}/${pIdSucursal}`;
        return this.DtoService.Get(url);
    }

    obtenerPorTipoYCodigo(pIdTipo: number, pCodigoStockeable: number) {
        let url = `Stock2/Depositos/Stockeable/ObtenerPorTipoYCodigo/${pIdTipo}/${pCodigoStockeable}`;
        return this.DtoService.Get(url);
    }

    obtenerTodosPorCodigoYNombre(filtro: any){
        let url = `Stock2/Depositos/Stockeable/ObtenerTodosPorCodigoYNombre/`;
        return this.DtoService.Post(url, filtro);
    }


    static serviceFactory() {
        const service = (log, dtoService) => new dataService(log, dtoService);
        service.$inject = ['Logger', 'DtoService'];
        return service;
    }
    // #endregion
}

export class StockeableDataService {
    static init(ngModule: angular.IModule) {
        ngModule.factory('StockeableDataService', dataService.serviceFactory())
    }
}