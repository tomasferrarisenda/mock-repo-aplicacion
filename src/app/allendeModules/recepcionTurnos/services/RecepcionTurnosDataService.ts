/**
* @author:         Pablo Pautasso
* @description:    Manejo de datos de recepcion de turnos
* @type:           Service
**/
import * as angular from 'angular';
import { IDtoService } from 'core/index';

export interface IRecepcionTurnosDataService {
    obtenerRecepcionPorUsuario(idUsuario): any;
    obtenerTurnosPorRecursoParaRecepcion(idRecurso: number, idTipoRecurso: number, idServicio: number, idSucursal: number, fechaDesde: any, fechaHasta: any): any;
    getNuevoDocumentoAsociadoDto():angular.IPromise<any>;
    obtenerPorTipoEntidad(idTipoEntidad):angular.IPromise<any>;
    ObtenerPorGruposDePrestaciones(listaDeIds):angular.IPromise<any>;
    elTurnoTieneCierreParticular(idTurno: number): angular.IPromise<any>;
}

class dataService implements IRecepcionTurnosDataService {
    // static $inject = ['Logger', 'DtoService'];
    
    constructor(private $log: ILogger, private DtoService: IDtoService) {
        this.$log = this.$log.getInstance('RecepcionTurnosDateService');
        this.$log.debug('ON');
    }
    
    
    obtenerRecepcionPorUsuario(idUsuario) {
        var _url = 'Comun/Lugares/Recepcion/ObtenerPorUsuario/' + idUsuario;
        return this.DtoService.Get(_url);
    }

    obtenerTurnosPorRecursoParaRecepcion(idRecurso, idTipoRecurso, idServicio, idSucursal, fechaDesde, fechaHasta){
        var _url = 'DisponibilidadDeTurnos/ObtenerTurnosPorRecursoParaRecepcion/' + idRecurso + '/' + idTipoRecurso + '/' + idServicio 
            + '/' + idSucursal + '/' + fechaDesde + '/' + fechaHasta;
        return this.DtoService.Get(_url);
    }

    static serviceFactory(log, dtoService) {
        return new dataService(log, dtoService);
    }

    getNuevoDocumentoAsociadoDto() {
        var _url = 'DocumentoAsociado/ObtenerNuevo';
        return this.DtoService.Get(_url);
    }
    
    obtenerPorTipoEntidad(idTipoEntidad){
        var _url = 'TipoDocumentoAsociado/ObtenerPorTipoEntidad/'+idTipoEntidad;
        return this.DtoService.Get(_url);
    }
    
    ObtenerPorGruposDePrestaciones(listaDeIds){
        var _url = 'PrestacionMedica/ObtenerPorGruposDePrestaciones/'+listaDeIds.trim();
        return this.DtoService.Get(_url);
    }

    elTurnoTieneCierreParticular(idTurno: number){
        var _url = 'Turnos/TurnoTieneCierreParticular/'+idTurno;
        return this.DtoService.Get(_url);
    }
}

dataService.serviceFactory.$inject = ['Logger', 'DtoService'];

export class RecepcionTurnosDataService {
    static init(ngModule: angular.IModule) {
        ngModule.factory('RecepcionTurnosDataService', dataService.serviceFactory)
    }
}