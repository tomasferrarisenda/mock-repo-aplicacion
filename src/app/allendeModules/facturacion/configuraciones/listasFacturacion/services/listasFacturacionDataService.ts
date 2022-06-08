/**
* @author: rbassi
* @description: listas Facturacion Data Service
* @type: Service
**/
import * as angular from 'angular';
import { IDtoService } from 'core/http';
import { FiltroListasFacturacionDTO } from '../models/filtroListasFacturacionDTO';
import { itemListaFacturacionDTO, ListaFacturacionEditDTO, ListaFacturacionListDto } from 'src/app/allendeModules/facturacion/configuraciones/listasFacturacion/models';

export interface IlistasFacturacionDataService {
    getAll(): angular.IPromise<any>;
    getOne(id: number): angular.IPromise<any>;
    getAllTipoPrefacturable(): angular.IPromise<any>;
    obtenerFiltro(): angular.IPromise<FiltroListasFacturacionDTO>;
    obtenerListadoFacturacion(filtroDto: FiltroListasFacturacionDTO): angular.IPromise<GridViewDto<ListaFacturacionListDto>>;
    eliminar(id: number): angular.IPromise<any>;
    obtenerListaFacturacionDtoParaEdicion(id: number): angular.IPromise<ListaFacturacionEditDTO>;
    validarGuardar(listaFacturacionEdit: ListaFacturacionEditDTO): angular.IPromise<any>;
    guardar(listaFacturacionEdit: ListaFacturacionEditDTO): angular.IPromise<any>;
    obtenerNuevoItemEdit():angular.IPromise<itemListaFacturacionDTO>;
    ExportarExcel(id: number): angular.IPromise<any>;
    ImportarExcel(listaDto: ListaFacturacionEditDTO): angular.IPromise<any>;
}

class dataService implements IlistasFacturacionDataService {

    // #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */

    /**
    * @class listasFacturacionDataService
    * @constructor
    */
    constructor(private $log: ILogger, private DtoService: IDtoService) {
        this.$log = this.$log.getInstance('listasFacturacionDataService');
        this.$log.debug('ON');
    }

    // #endregion

    // #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */



    getAll() {
        let url = 'Api/';
        return this.DtoService.Get(url);
    }

    getOne(id) {
        let url = `Api/${id}`;
        return this.DtoService.Get(url);
    }


    getAllTipoPrefacturable() {
        var _url = 'TipoPrefacturable/ObtenerTodos';
        return this.DtoService.Get(_url, { isCachable: true });
    }

    obtenerFiltro() {
        var _url = 'ListasFacturacion/CrearFiltroListasFacturacion';
        return this.DtoService.Get(_url);
    }

    obtenerListadoFacturacion(filtroDto) {
        var _url = 'ListasFacturacion/ObtenerPorFiltroListasFacturacion';
        return this.DtoService.Post(_url, filtroDto);
    }

    eliminar(id) {
      var _url = 'ListasFacturacion/Eliminar/' + id;
      return this.DtoService.Get(_url);
    } 

     obtenerListaFacturacionDtoParaEdicion(id) {
      var _url = 'ListasFacturacion/ObtenerListaFacturacionDtoParaEdicion/' + id;
      return this.DtoService.Get(_url);
    }

    static serviceFactory() {
        const service = (log, dtoService) => new dataService(log, dtoService);
        service.$inject = ['Logger', 'DtoService'];
        return service;
    }

    validarGuardar(listaFacturacionEdit) {
        var _url = 'ListasFacturacion/ValidarGuardar';
        return this.DtoService.Post(_url, listaFacturacionEdit);
    }

    guardar(listaFacturacionEdit) {
       var _url = 'ListasFacturacion/Guardar';
        return this.DtoService.Post(_url, listaFacturacionEdit);
    }

    obtenerNuevoItemEdit() {
       var _url = 'ListasFacturacion/ObtenerNuevoItemEdit';
       return this.DtoService.Get(_url);
    }

    ExportarExcel(id) {
        var _url = 'ListasFacturacion/ExportarExcel/' + id;
        return this.DtoService.DownloadFile(_url, 'ListaFacturacion.xlsx');
    }

    ImportarExcel(listaDto) {
        var _url = 'ListasFacturacion/ImportarExcel';
        return this.DtoService.Post(_url, listaDto);
    }

    // #endregion
}

export class listasFacturacionDataService {
    static init(ngModule: angular.IModule) {
        ngModule.factory('listasFacturacionDataService', dataService.serviceFactory())
    }
}