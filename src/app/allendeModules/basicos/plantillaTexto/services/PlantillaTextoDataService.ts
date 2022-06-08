/**
* @author: aminoldo
* @description: Plantilla de Texto
* @type: Service
**/
import * as angular from 'angular';
import { IDtoService } from 'core/http';
import { FiltroPlantillaTextoDto } from '../model/filtroPlantillaTextoDto';
import { plantillaTextoDto } from '../model/plantillaTextoDto';

export interface IPlantillaTextoDataService {
    getAll(): angular.IPromise<any>;
    getOne(id: number): angular.IPromise<plantillaTextoDto>;
    ObtenerPorFiltros(filtro: FiltroPlantillaTextoDto): angular.IPromise<any>;
    ObtenerFiltroBusqueda(): angular.IPromise<any>;
    TiposDeProposito(): angular.IPromise<any>;
    NuevaPlantillaTexto(): angular.IPromise<plantillaTextoDto>;
    Eliminar(id:number):angular.IPromise<any>;
    ObtenerTodosTipoFormatoPlantillaTexto(): angular.IPromise<any>;
    ObtenerPorIdTipoFormatoPlantillaTexto(id): angular.IPromise<any>;
    ObtenerEtiquetasPorTipoProposito(idTipoProposito): angular.IPromise<any>;
    guardar(plantillaDeTexto: plantillaTextoDto): angular.IPromise<any>;
}

class dataService implements IPlantillaTextoDataService {

    // #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */

    /**
    * @class NameDataService
    * @constructor
    */
    constructor(private $log: ILogger, private DtoService: IDtoService) {
        this.$log = this.$log.getInstance('PlantillaTextoDataService');
        this.$log.debug('ON');
    }

    // #endregion

    // #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

    getAll() {
        let url = 'Api/';
        return this.DtoService.Get(url);
    }

    getOne(id) {
        let url = 'PlantillasTexto/PlantillaTexto/ObtenerPorId/'+id;
        return this.DtoService.Get(url);
    }

    ObtenerPorFiltros(filtro) {
        var url = 'PlantillasTexto/PlantillaTexto/ObtenerPorFiltros';
        return this.DtoService.Post(url, filtro);
    }

    ObtenerFiltroBusqueda() {
        var url = 'PlantillasTexto/PlantillaTexto/ObtenerFiltroBusqueda';
        return this.DtoService.Get(url);
    }

    TiposDeProposito() {
        var url = 'PlantillasTexto/TipoPropositoPlantillaTexto/ObtenerTodos';
        return this.DtoService.Get(url, { isCachable: true });
    }

    ObtenerEtiquetasPorTipoProposito(idTipoProposito) {
        var url = 'PlantillasTexto/Etiqueta/ObtenerPorTipoProposito/' + idTipoProposito;
        return this.DtoService.Get(url);
    }


    NuevaPlantillaTexto() {
        var url = 'PlantillasTexto/PlantillaTexto/ObtenerNuevo';
        return this.DtoService.Get(url);
    };


    Eliminar(id){
        var url = 'PlantillasTexto/PlantillaTexto/Eliminar/'+id;
        return this.DtoService.Get(url);
    };

    guardar(plantillaDeTexto) {
        var _url = 'PlantillasTexto/PlantillaTexto/Guardar/';
        return this.DtoService.Post(_url, plantillaDeTexto);
    }


    ObtenerTodosTipoFormatoPlantillaTexto() {
        var url = 'PlantillasTexto/TipoFormatoPlantillaTexto/ObtenerTodos';
        return this.DtoService.Get(url, { isCachable: true });
    }

    ObtenerPorIdTipoFormatoPlantillaTexto(id) {
        var url = 'PlantillasTexto/TipoFormatoPlantillaTexto/ObtenerPorId/'+id;
        return this.DtoService.Get(url, { isCachable: true });
    }


    static serviceFactory() {
        const service = (log, dtoService) => new dataService(log, dtoService);
        service.$inject = ['Logger', 'DtoService'];
        return service;
    }
    // #endregion
}

export class PlantillaTextoDataService {
    static init(ngModule: angular.IModule) {
        ngModule.factory('PlantillaTextoDataService', dataService.serviceFactory())
    }
}