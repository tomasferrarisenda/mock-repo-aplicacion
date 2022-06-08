/**
* @author: crusso
* @description: Corte Facturación Data Service
* @type: Service
**/
import * as angular from 'angular';
import { IDtoService } from 'core/http';
import { filtroCorteFacturacionDTO, corteFacturacionDTO } from '../model';

export interface ICorteFacturacionDataService {
    getAll(): angular.IPromise<any>;
    getOne(id: number): angular.IPromise<corteFacturacionDTO>;

    ObtenerListadoPorFiltro(filtro: filtroCorteFacturacionDTO): angular.IPromise<any>;
    eliminarCorteFacturacion(corteId: number):angular.IPromise<any>//Corroborar si va el ANY con
    guardar(corte: corteFacturacionDTO): angular.IPromise<any>;
    nuevoCorteFacturacion(): angular.IPromise<filtroCorteFacturacionDTO>;
    ObtenerNuevoFiltro(): angular.IPromise<any>
}

class dataService implements ICorteFacturacionDataService {

    // #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */

    /**
    * @class CorteFacturacionDataService
    * @constructor
    */
    constructor(private $log: ILogger, private DtoService: IDtoService) {
        this.$log = this.$log.getInstance('CorteFacturacionDataService'); 
        this.$log.debug('ON');
    }

    // #endregion

    // #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

    getAll() {
        var url = 'FechasCorte/ObtenerTodos';//Colocar siempre la Ruta del back
        return this.DtoService.Get(url);
    }

    getOne(id) {
        var url = 'FechasCorte/ObtenerPorId/' + id;//Colocar siempre la Ruta del back tener en cuenta poner siempre la /
        return this.DtoService.Get(url);
    }
    
    ObtenerNuevo() {
        var url = 'FechasCorte/ObtenerNuevo';//Colocar siempre la Ruta del back
        return this.DtoService.Get(url);
    }

    ObtenerNuevoFiltro() {
        var url = 'FechasCorte/ObtenerNuevoFiltro/';
        this.$log.debug('FechaCorte/ObtenerNuevoFiltro/', url)
        return this.DtoService.Get(url);
    }

    eliminarCorteFacturacion(id) {
        var url = 'FechasCorte/Eliminar/' + id;
        return this.DtoService.Get(url);
    }

    //Obtener Datos del Back//
    ObtenerListadoPorFiltro(filtro) {
        var url = 'FechasCorte/ObtenerListadoPorFiltro/';
        this.$log.debug('FechasCorte/ObtenerListadoPorFiltro/', url);
        return this.DtoService.Post(url, filtro);
    }

    static serviceFactory() {
        const service = (log, dtoService) => new dataService(log, dtoService);
        service.$inject = ['Logger', 'DtoService'];
        return service;
    }

    ///Descargar Listado ///	
    getAllSucursalesCombo() {
        var _url = 'Sucursal/ObtenerTodas';
        return this.DtoService.Get(_url, { isCachable: true });
    }

    //Guardar Modal//
    guardar(tecnico: corteFacturacionDTO) {
        var url = 'FechasCorte/Guardar';
        return this.DtoService.Post(url, tecnico);
    }

    nuevoCorteFacturacion() {
        var url = 'FechasCorte/ObtenerNuevo';
        return this.DtoService.Get(url);
    }
    // #endregion
}

export class CorteFacturacionDataService {
    static init(ngModule: angular.IModule) {
        ngModule.factory('CorteFacturacionDataService', dataService.serviceFactory())
    }
}
