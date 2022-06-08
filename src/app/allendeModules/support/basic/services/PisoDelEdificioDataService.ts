/**
* @author: ppautasso
* @description: Data service para obtener pisos por edificio
* @type: Service
**/
import * as angular from 'angular';
import { IDtoService } from 'core/http';

export interface IPisoDelEdificioDataService {
    getAll(): angular.IPromise<any>;
    getOne(id: number): angular.IPromise<any>;
    obtenerPorEdificioDeSucursal(pIdEdificio: number): angular.IPromise<any>; //Agregado Recientemente
    obtenerPorEdificioId(pIdEdificio: number): angular.IPromise<any>;
    obtenerPisosPorSucursalHabilitadosAlUsuario(pIdSucursal: number): angular.IPromise<any>;
    obtenerPisosPorSucursalHabilitadosAlUsuarioConDepositos(pIdSucursal: number): angular.IPromise<any>;
}

class dataService implements IPisoDelEdificioDataService {

    // #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */

    /**
    * @class PisoDelEdificioDataService
    * @constructor
    */
    constructor(private $log: ILogger, private DtoService: IDtoService) {
        this.$log = this.$log.getInstance('PisoDelEdificioDataService');
        this.$log.debug('ON');
    }

    // #endregion

    // #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

    getAll() {
        let url = 'Comun/Lugares/PisoDeEdificio/';
        return this.DtoService.Get(url);
    }

    getOne(id) {
        let url = `Comun/Lugares/PisoDeEdificio/${id}`;
        return this.DtoService.Get(url);
    }

    //Agrega Combo de Edificio
    obtenerPorEdificioDeSucursal(pIdSucursal) {
        let url = `Comun/Lugares/Edificio/ObtenerPorSucursal/${pIdSucursal}`;
        return this.DtoService.Get(url);
    }

    obtenerPorEdificioId(pIdEdificio: number){
        let url = `Comun/Lugares/PisoDeEdificio/ObtenerPorEdificio/${pIdEdificio}`;
        return this.DtoService.Get(url);
    }

    obtenerPisosPorSucursalHabilitadosAlUsuario(pIdSucursal){
        let url = `Comun/Lugares/PisoDeEdificio/ObtenerPisosPorSucursalHabilitadosAlUsuario/${pIdSucursal}`;
        return this.DtoService.Get(url);
    }

    obtenerPisosPorSucursalHabilitadosAlUsuarioConDepositos(pIdSucursal){
        let url = `Comun/Lugares/PisoDeEdificio/ObtenerPisosPorSucursalHabilitadosAlUsuario/${pIdSucursal}`;
        return this.DtoService.Get(url);
    }

    static serviceFactory() {
        const service = (log, dtoService) => new dataService(log, dtoService);
        service.$inject = ['Logger', 'DtoService'];
        return service;
    }
    // #endregion
}

export class PisoDelEdificioDataService {
    static init(ngModule: angular.IModule) {
        ngModule.factory('PisoDelEdificioDataService', dataService.serviceFactory())
    }
}