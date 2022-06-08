/**
* @author: ppautasso
* @description: data service para sector de internacion
* @type: Service
**/
import * as angular from 'angular';
import { IDtoService } from 'core/http';

export interface ISectorDeInternacionDataService {
    getAll(): angular.IPromise<any>;
    getOne(id: number): angular.IPromise<any>;
    obtenerPorPiso(pIdPiso: number): angular.IPromise<any>;
    obtenerPorPisoConDeposito(pIdPiso: number): angular.IPromise<any>;
    obtenerAsignablesAEnfermera(pIdEnfermera: number): angular.IPromise<any>;
    obtenerAsignadosPorDefectoAEnfermera(pIdEnfermera: number): angular.IPromise<any>;

}

class dataService implements ISectorDeInternacionDataService {

    // #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */

    /**
    * @class SectorDeInternacionDataService
    * @constructor
    */
    constructor(private $log: ILogger, private DtoService: IDtoService) {
        this.$log = this.$log.getInstance('SectorDeInternacionDataService');
        this.$log.debug('ON');
    }

    // #endregion

    // #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

    getAll() {
        let url = 'Comun/Lugares/SectorDeInternacion/';
        return this.DtoService.Get(url);
    }

    getOne(id) {
        let url = `Comun/Lugares/SectorDeInternacion/${id}`;
        return this.DtoService.Get(url);
    }

    obtenerPorPiso(pIdPiso: number){
        let url = `Comun/Lugares/SectorDeInternacion/ObtenerPorPiso/${pIdPiso}`;
        return this.DtoService.Get(url);
    }

    obtenerPorPisoConDeposito(pIdPiso: number) {
        let url = `Comun/Lugares/SectorDeInternacion/ObtenerPorPisoConDeposito/${pIdPiso}`;
        return this.DtoService.Get(url);
    }

    obtenerAsignablesAEnfermera(pIdEnfermera: number){
        let url = `Comun/Lugares/SectorDeInternacion/ObtenerAsignablesAEnfermera/${pIdEnfermera}`;
        return this.DtoService.Get(url);
    }
  
    obtenerAsignadosPorDefectoAEnfermera(pIdEnfermera: number){
        let url = `Comun/Lugares/SectorDeInternacion/ObtenerAsignadosPorDefectoAEnfermera/${pIdEnfermera}`;
        return this.DtoService.Get(url);
    }
    
     static serviceFactory() {
        const service = (log, dtoService) => new dataService(log, dtoService);
        service.$inject = ['Logger', 'DtoService'];
        return service;
    }
    // #endregion
}

export class SectorDeInternacionDataService {
    static init(ngModule: angular.IModule) {
        ngModule.factory('SectorDeInternacionDataService', dataService.serviceFactory())
    }
}