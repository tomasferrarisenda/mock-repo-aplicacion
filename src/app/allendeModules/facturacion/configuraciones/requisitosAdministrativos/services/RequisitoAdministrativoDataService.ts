/**
* @author: aminoldo
* @description: Llamadas de Requisitos Administrativos
* @type: Service
**/
import * as angular from 'angular';
import { IDtoService } from 'core/http';
import { FiltroRequisitoAdministrativoDto } from '../model/filtroRequisitoAdministrativoDto';
import { requisitoAdministrativoDto } from '../model/requisitoAdministrativoDto';

export interface IRequisitoAdministrativoDataService {
    getAll(): angular.IPromise<any>;
    getOne(id: number): angular.IPromise<requisitoAdministrativoDto>;
    ObtenerFiltroRequisitos(): angular.IPromise<any>;
    ObtenerRequisitoPorFiltro(filtro: FiltroRequisitoAdministrativoDto): angular.IPromise<any>;
    TiposDeRequisitos(): angular.IPromise<any>;
    eliminar(id: number): angular.IPromise<any>;
    nuevoRequisitoAdministrativo(): angular.IPromise<requisitoAdministrativoDto>;
    Guardar(RequisitoAdministrativo:requisitoAdministrativoDto):angular.IPromise<any>;
}

class dataService implements IRequisitoAdministrativoDataService {

    // #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */

    /**
    * @class NameDataService
    * @constructor
    */
    constructor(private $log: ILogger, private DtoService: IDtoService) {
        this.$log = this.$log.getInstance('RequisitoAdministrativoDataService');
        this.$log.debug('ON');
    }

    // #endregion

    // #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

    getAll() {
        let url = 'Api/';
        return this.DtoService.Get(url);
    }

    getOne(id) {
        let url = 'RequisitosAdministrativos/ObtenerRequisitoAdministrativoDtoParaEdicion/' + id;
        return this.DtoService.Get(url);
    }

    ObtenerFiltroRequisitos() {
        var url = 'RequisitosAdministrativos/ObtenerFiltroRequisitos';
        return this.DtoService.Get(url);
    }

    ObtenerRequisitoPorFiltro(filtro) {
        var url = 'RequisitosAdministrativos/ObtenerPorFiltroRequisitosAdministrativos';
        return this.DtoService.Post(url, filtro);
    }

    TiposDeRequisitos() {
        var url = 'TipoRequisito/ObtenerTodos';
        return this.DtoService.Get(url, { isCachable: true });
    }

    eliminar(id) {
        var url = 'RequisitosAdministrativos/Eliminar/' + id;
        return this.DtoService.Get(url);
    }

    nuevoRequisitoAdministrativo() {
        var url = 'RequisitosAdministrativos/ObtenerNuevo';
        return this.DtoService.Get(url);
    };

    
    Guardar(RequisitoAdministrativo) {
        var url = 'RequisitosAdministrativos/Guardar';
        return this.DtoService.Post(url, RequisitoAdministrativo);
    };


    static serviceFactory() {
        const service = (log, dtoService) => new dataService(log, dtoService);
        service.$inject = ['Logger', 'DtoService'];
        return service;
    }
    // #endregion
}

export class RequisitoAdministrativoDataService {
    static init(ngModule: angular.IModule) {
        ngModule.factory('RequisitoAdministrativoDataService', dataService.serviceFactory())
    }
}