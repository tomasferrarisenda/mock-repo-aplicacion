/**
* @author: ppautasso
* @description: Data Service para grupo de mutuales
* @type: Service
**/
import * as angular from 'angular';
import { IDtoService } from 'core/http';

export interface IGrupoDeMutualesDataService {
    getAll(): angular.IPromise<any>;
    getOne(id: number): angular.IPromise<any>;
}

class dataService implements IGrupoDeMutualesDataService {

    // #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */

    /**
    * @class GrupoDeMutualesDataService
    * @constructor
    */
    constructor(private $log: ILogger, private DtoService: IDtoService) {
        this.$log = this.$log.getInstance('GrupoDeMutualesDataService');
        this.$log.debug('ON');
    }

    // #endregion

    // #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

    getAll() {
        let url = 'Financiadores/Grupos/GrupoDeMutuales/ObtenerTodos';
        return this.DtoService.Get(url);
    }

    getOne(id) {
        let url = `Financiadores/Grupos/GrupoDeMutuales/${id}`;
        return this.DtoService.Get(url);
    }

    static serviceFactory() {
        const service = (log, dtoService) => new dataService(log, dtoService);
        service.$inject = ['Logger', 'DtoService'];
        return service;
    }
    // #endregion
}

export class GrupoDeMutualesDataService {
    static init(ngModule: angular.IModule) {
        ngModule.factory('GrupoDeMutualesDataService', dataService.serviceFactory())
    }
}