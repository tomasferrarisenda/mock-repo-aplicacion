/**
* @author: ppautasso
* @description: Data service para deposito 
* @type: Service
**/
import * as angular from 'angular';

import { IDtoService, GetDataService, IGetDataService } from '../../../../core/http';

import {ItemStockDepositoParaConfiguracion} from '../../../farmacia/models'

export interface IDepositoDataService extends IGetDataService<IEntidadDto> {
    obtenerPorIdSector(pIdSector: number): angular.IPromise<any>;
    obtenerStockDelDeposito(pIdDeposito: number): angular.IPromise<any>;
    obtenerStockDelDepositoParaConfiguracion(pIdDeposito: number): angular.IPromise<any>;
    guardarItemStockDeposito(pItemStockDepositoParaConfiguracion: ItemStockDepositoParaConfiguracion): angular.IPromise<any>;
    agregarStockeable(pIdDeposito: number, pIdTipoStockeable: number, pIdStockeable: number, pStockNormal: number, pCantidadMaxima: number): angular.IPromise<any>;
    eliminarItemStockDeposito(id: number): angular.IPromise<any>;
    exportarPdfStockDelDeposito(pDeposito: any): angular.IPromise<any>;
    exportarPdfStockAReponer(pDeposito: any): angular.IPromise<any>;
    editarStockNormalProducto(idItemStockDeposito: number, stockNormal:number): angular.IPromise<any>;
    editarCantidadMaximaProducto(idItemStockDeposito: number, cantidadMaxima:number): angular.IPromise<any>;
}

class dataService extends GetDataService<IEntidadDto> implements IDepositoDataService {

    // #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */

    /**
    * @class DepositoDataService
    * @constructor
    */
    constructor($log: ILogger, http: IDtoService) {
        super($log, http, 'Stock2/Depositos/Deposito/')
        this.$log = this.$log.getInstance('DepositoDataService');
        this.$log.debug('ON');
    }

    // #endregion

    // #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */
   
    obtenerPorIdSector(pIdSector: number){
        let url = `Stock2/Depositos/Deposito/ObtenerPorIdSector/${pIdSector}`;
        return this.http.Get(url);
    }

    obtenerStockDelDeposito(pIdDeposito: number){
        let url = `Stock2/Depositos/Deposito/ObtenerStockDelDeposito/${pIdDeposito}`;
        return this.http.Get(url);
    }

    obtenerStockDelDepositoParaConfiguracion(pIdDeposito: number){
        let url = `Stock2/Depositos/Deposito/ObtenerStockDelDepositoParaConfiguracion/${pIdDeposito}`;
        return this.http.Get(url);
    }

    guardarItemStockDeposito(pItemStockDepositoParaConfiguracion: ItemStockDepositoParaConfiguracion){
        let url = `Stock2/Depositos/Deposito/GuardarItemStockDeposito/`;
        return this.http.Post(url, pItemStockDepositoParaConfiguracion);
    }

    agregarStockeable(pIdDeposito: number, pIdTipoStockeable: number, pIdStockeable: number, pStockNormal: number, pCantidadMaxima: number){
        let url = `Stock2/Depositos/Deposito/AgregarStockeable/${pIdDeposito}/${pIdTipoStockeable}/${pIdStockeable}/${pStockNormal}/${pCantidadMaxima}`;
        return this.http.Get(url);
    }

    eliminarItemStockDeposito(id: number){
        let url = `Stock2/Depositos/Deposito/EliminarItemStockDeposito/${id}`;
        return this.http.Get(url);
    }

    exportarPdfStockDelDeposito(pDeposito){
        let url = `Stock2/Depositos/Deposito/ExportarPdfStockDelDeposito/${pDeposito.Id}`;
        return this.http.DownloadFile(url, 'StockDelDeposito:' + pDeposito.Nombre + '.pdf');
    }

    exportarPdfStockAReponer(pDeposito){
        let url = `Stock2/Depositos/Deposito/ExportarPdfStockAReponer/${pDeposito.Id}`;
        return this.http.DownloadFile(url, 'StockAReponer - Deposito:' + pDeposito.Nombre + '.pdf');
    }

    editarStockNormalProducto(idItemStockDeposito: number, stockNormal:number){
        let url = `Stock2/Depositos/Deposito/EditarStockNormal/${idItemStockDeposito}/${stockNormal}`;
        return this.http.Get(url);
    }

    editarCantidadMaximaProducto(idItemStockDeposito: number, cantidadMaxima:number){
        let url = `Stock2/Depositos/Deposito/EditarCantidadMaxima/${idItemStockDeposito}/${cantidadMaxima}`;
        return this.http.Get(url);
    }

    static serviceFactory() {
        const service = (log, dtoService) => new dataService(log, dtoService);
        service.$inject = ['Logger', 'DtoService'];
        return service;
    }
    // #endregion
}

export class DepositoDataService {
    static init(ngModule: angular.IModule) {
        ngModule.factory('DepositoDataService', dataService.serviceFactory())
    }
}