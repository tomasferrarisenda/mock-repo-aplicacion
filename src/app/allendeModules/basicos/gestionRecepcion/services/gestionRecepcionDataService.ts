/**
* @author: crusso
* @description: Gestion Recepcion Data Service
* @type: Service
**/
import * as angular from 'angular';
import { IDtoService } from 'core/http';
import { filtroGestionRecepcionDto, gestionRecepcionListDto } from '../model';

export interface IGestionRecepcionDataService {
    obtenerPorSucursalEdificioPisoDescripcion(idSucursal, idEdificio, idPiso, currentPage, pageSize, descripcionRecepcion?): angular.IPromise<any>;
    getOne(id: number): angular.IPromise<any>;
    guardar(listadoGestionRecepcion): angular.IPromise<any>;
    obtenerNuevo():angular.IPromise<gestionRecepcionListDto>;
    eliminar(id: number): angular.IPromise<any>;
    TiposGestionRecepcion(): angular.IPromise<any>;

    // obtenerFiltro(): angular.IPromise<filtroGestionRecepcionDto>;
}

class dataService implements IGestionRecepcionDataService {

    // #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */

    /**
    * @class GestionRecepcionDataService
    * @constructor
    */
    constructor(private $log: ILogger, private DtoService: IDtoService) {
        this.$log = this.$log.getInstance('GestionRecepcionDataService');
        this.$log.debug('ON');
    }

    // #endregion

    // #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

    //{ idSucursal } /{idEdificio}/{ idPiso } /{descripcionRecepcion?
    obtenerPorSucursalEdificioPisoDescripcion(idSucursal, idEdificio, idPiso, currentPage, pageSize, descripcionRecepcion?) { 
        let url = 'Comun/Lugares/Recepcion/ObtenerPorSucursalEdificioPisoDescripcion/' + idSucursal + '/' + idEdificio + '/' + idPiso + '/' + currentPage + '/' + pageSize + '/' + descripcionRecepcion;
        return this.DtoService.Get(url);
    }

    getOne(id) { //Corroborar Ruta de Acceso!
        let url = `Comun/Lugares/Recepcion/ObtenerPorId/${id}`;
        return this.DtoService.Get(url);
    }

    guardar(listadoGestionRecepcion) {//Ver RUTA si esta Bien//
        var _url = 'Comun/Lugares/Recepcion/Guardar';
        return this.DtoService.Post(_url, listadoGestionRecepcion);
    }

    obtenerNuevo(){
        var url = `Comun/Lugares/Recepcion/ObtenerNuevo`;
        return this.DtoService.Get(url);
    }
    //El cliente elige la Sucursal y por ende aparece los Edificios.
    
    eliminar(id) {//Ver RUTA si esta Bien//
        var _url = 'Comun/Lugares/Recepcion/Eliminar/' + id;
        return this.DtoService.Get(_url);
    } 

    TiposGestionRecepcion(){        
    var url = 'Comun/Lugares/Recepcion/ObtenerTodos';
    return this.DtoService.Get(url);
    }

    // obtenerFiltro() {
    //     var _url = 'ObtenerPorUsuario/${idUsuario}';
    //     return this.DtoService.Get(_url);
    // }

    static serviceFactory() {
        const service = (log, dtoService) => new dataService(log, dtoService);
        service.$inject = ['Logger', 'DtoService'];
        return service;
    }
    // #endregion 
}

export class GestionRecepcionDataService {
    static init(ngModule: angular.IModule) {
        ngModule.factory('GestionRecepcionDataService', dataService.serviceFactory())
    }
}