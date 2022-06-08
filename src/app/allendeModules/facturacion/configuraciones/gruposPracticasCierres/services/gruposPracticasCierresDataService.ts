/**
* @author: rbassi
* @description: Llamadas de grupos de practicas para cierres
* @type: Service
**/
import * as angular from 'angular';
import { IDtoService } from 'core/http';

export interface IGruposPracticasCierresDataService {
    ObtenerGruposPracticasParaCierre(idSucursal,idServicio): angular.IPromise<any>;
    ObtenerGrupoPracticasPorId(id): angular.IPromise<any>;
    guardar(GrupoPracticas): angular.IPromise<any>;
    eliminar(idGrupoPracticas): angular.IPromise<any>;
    ObtenerEstados(): angular.IPromise<any>;
    ObtenerNuevo():angular.IPromise<any>;
    ObtenerServiciosPorSucursal(idSucursal): angular.IPromise<any>;
    ObtenerTodosLosServicios(): angular.IPromise<any>;

}

class dataService implements IGruposPracticasCierresDataService {

    // #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */

    /**
    * @class NameDataService
    * @constructor
    */
    constructor(private $log: ILogger, private DtoService: IDtoService) {
        this.$log = this.$log.getInstance('GruposPracticasCierresDataService');
        this.$log.debug('ON');
    }

    // #endregion

    // #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */
    ObtenerGruposPracticasParaCierre(idSucursal,idServicio){
        var url = 'GrupoPracticasCierre/ObtenerPorFiltros/'+idSucursal+'/'+idServicio;
        return this.DtoService.Get(url);
    };

    ObtenerGrupoPracticasPorId(id){
        var url = 'GrupoPracticasCierre/ObtenerPorId/'+id;
        return this.DtoService.Get(url);
    };


    guardar(GrupoPracticas) {
         var _url = 'GrupoPracticasCierre/Guardar';
         return this.DtoService.Post(_url, GrupoPracticas);
    }

    eliminar(idGrupoPracticas){
        var url = 'GrupoPracticasCierre/Eliminar/'+idGrupoPracticas;
        return this.DtoService.Get(url);
    };

    ObtenerEstados(){
        var url = 'EstadoCierreRecepcion/ObtenerTodos';
        return this.DtoService.Get(url);
    };

    ObtenerNuevo(){
        var url = 'GrupoPracticasCierre/ObtenerNuevo';
        return this.DtoService.Get(url);
    };

    ObtenerServiciosPorSucursal(idSucursal){
        var url = 'Servicio/ObtenerPorSucursal/'+idSucursal;
        return this.DtoService.Get(url);
    };
    
    ObtenerTodosLosServicios(){
        var url = 'Servicio/ObtenerTodos/true/false';
        return this.DtoService.Get(url);
    };




	static serviceFactory() {
        const service = (log, dtoService) => new dataService(log, dtoService);
        service.$inject = ['Logger', 'DtoService'];
        return service;
    }
    // #endregion
}

export class GruposPracticasCierresDataService {
    static init(ngModule: angular.IModule) {
        ngModule.factory('GruposPracticasCierresDataService', dataService.serviceFactory())
    }
}