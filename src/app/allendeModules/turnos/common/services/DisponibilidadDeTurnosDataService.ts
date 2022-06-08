/**
* @author: pablo pautasso
* @description: DAta service para disponibilidad de turnos
* @type: Service
**/
import * as angular from 'angular';
import { IDtoService } from 'core/http';
import { FiltroReporteGenericoDeTurnosDto, FiltroObtenerTurnosPorRecursoDto } from '../models';

export interface IDisponibilidadDeTurnosDataService {

    obtenerTurnosPorRecursoListaCompletaDelDia(criterioBusquedaConFecha: any): any;
    obtenerTurnosDisponiblesConReglasExplicadas(criterioBusquedaConFecha: any): any;
    obtenerReporteProximoTurnoDisponible(criterioBusquedaConFecha: any): any;
    obtenerReporteTurnosPorRecursoSimple(pIdRecurso: number, pIdTipoRecurso: number, pIdServicio: number, pIdSucursal: number, pFechaDesde: any, pFechaHasta: any): any;
    obtenerReporteTurnosPorRecursoCompleto(pIdRecurso: number, pIdTipoRecurso: number, pIdServicio: number, pIdSucursal: number, pFechaDesde: any, pFechaHasta: any): any;
    obtenerReporteGenericoPorFechaDeAtencion(pFiltroBusqueda: FiltroReporteGenericoDeTurnosDto): any;
    obtenerReporteGenericoPorFechaDeOtorgamiento(pFiltroBusqueda: FiltroReporteGenericoDeTurnosDto): any;
    obtenerReporteTurnosConPrefacturaPorRecurso(pRecurso:number, pIdTipoRecurso:number, pIdServicio: number, pIdSucursal: number, pFechaDesde: string, pFechaHasta: string): any;
    obtenerNuevoFiltroReporteGenericoDeTurnos(): any;
    ObtenerTurnosAsignablesDelDia(criterioBusquedaConFecha: any): any;
    obtenerTurnosPorRecursoParaAgendaConsultorio(pIdRecurso: any, pIdTipoRecurso: any, pIdServicio: any, pIdSucursal: any, pFecha: any, pMostrarCancelados: any, 
        pIncluirDemoraSala: any, pIncluirDemoraTurnos: any, pIncluirConfirmacion: any, pIncluirMutualFacturada: any): any;
    obtenerCalendarioDisponibilidadGeneral(pIdRecurso: number, pIdTipoRecurso: number, pIdServicio: number, pIdSucursal: number, fechaDesde: string, fechaHasta: string, soloAgendaActiva: boolean): any;
    obtenerTurnosPorRecurso(filtroObtenerTurnosPorRecursoDTO: FiltroObtenerTurnosPorRecursoDto): any;

}

class dataService implements IDisponibilidadDeTurnosDataService {

    constructor(private $log: ILogger, private DtoService: IDtoService) {
        this.$log = this.$log.getInstance('DisponibilidadDeTurnosDateService');
        this.$log.debug('ON');
    }

    obtenerTurnosPorRecursoListaCompletaDelDia(criterioBusquedaConFecha) {
        var _url = 'DisponibilidadDeTurnos/ObtenerTurnosPorRecursoListaCompletaDelDia';
        return this.DtoService.Post(_url, criterioBusquedaConFecha);
    }

    obtenerTurnosDisponiblesConReglasExplicadas(criterioBusquedaConFecha) {
        var _url = 'DisponibilidadDeTurnos/ObtenerTurnosDisponiblesConReglasExplicadas';
        return this.DtoService.Post(_url, criterioBusquedaConFecha);
    }

    obtenerReporteProximoTurnoDisponible(criterioBusquedaConFecha) {
        var _url = 'DisponibilidadDeTurnos/ObtenerReporteProximoTurnoDisponible';
        return this.DtoService.Post(_url, criterioBusquedaConFecha);
    }

    obtenerReporteTurnosPorRecursoSimple(pIdRecurso, pIdTipoRecurso, pIdServicio, pIdSucursal, pFechaDesde, pFechaHasta) {
        var _url = 'DisponibilidadDeTurnos/ObtenerReporteTurnosPorRecursoSimple/' + pIdRecurso + "/" + pIdTipoRecurso + "/" + pIdServicio + "/" +
            pIdSucursal + "/" + pFechaDesde + "/" + pFechaHasta;
        return this.DtoService.Get(_url);
    }

    obtenerReporteTurnosPorRecursoCompleto(pIdRecurso, pIdTipoRecurso, pIdServicio, pIdSucursal, pFechaDesde, pFechaHasta) {
        var _url = 'DisponibilidadDeTurnos/ObtenerReporteTurnosPorRecursoCompleto/' + pIdRecurso + "/" + pIdTipoRecurso + "/" + pIdServicio + "/" +
            pIdSucursal + "/" + pFechaDesde + "/" + pFechaHasta;
        return this.DtoService.Get(_url);
    }

    obtenerReporteGenericoPorFechaDeAtencion(pFiltroBusqueda: FiltroReporteGenericoDeTurnosDto) {
        var _url = 'DisponibilidadDeTurnos/ObtenerReporteGenericoPorFechaDeAtencion';
        return this.DtoService.Post(_url, pFiltroBusqueda);
    }

    obtenerReporteGenericoPorFechaDeOtorgamiento(pFiltroBusqueda: FiltroReporteGenericoDeTurnosDto) {
        var _url = 'DisponibilidadDeTurnos/ObtenerReporteGenericoPorFechaDeOtorgamiento';
        return this.DtoService.Post(_url, pFiltroBusqueda);
    }

    obtenerReporteTurnosConPrefacturaPorRecurso(pRecurso:any, pIdTipoRecurso:number, pIdServicio: number, pIdSucursal: number, pFechaDesde: string, pFechaHasta: string){
        var _url = 'DisponibilidadDeTurnos/ObtenerReporteTurnosConPrefacturaPorRecurso/' + pRecurso.Id + "/" + pIdTipoRecurso + "/" + pIdServicio + "/" +
        pIdSucursal + "/" + pFechaDesde + "/" + pFechaHasta;
        return this.DtoService.DownloadFile(_url, 'Reporte Turnos - ' + pRecurso.Nombre + ' - ' + pFechaDesde + '.pdf');
    }

    obtenerNuevoFiltroReporteGenericoDeTurnos(){
        var _url = 'DisponibilidadDeTurnos/ObtenerNuevoFiltroReporteGenericoDeTurnos';
        return this.DtoService.Get(_url);
    }

    ObtenerTurnosAsignablesDelDia(criterioBusquedaConFecha) {
        var _url = 'DisponibilidadDeTurnos/ObtenerTurnosAsignablesDelDia';
        return this.DtoService.Post(_url, criterioBusquedaConFecha);
    }

    obtenerTurnosPorRecursoParaAgendaConsultorio(pIdRecurso, pIdTipoRecurso, pIdServicio, pIdSucursal, pFecha, pMostrarCancelados, pIncluirDemoraSala, pIncluirDemoraTurnos, pIncluirConfirmacion,
        pIncluirMutualFacturada){
        var _url = 'DisponibilidadDeTurnos/ObtenerTurnosPorRecursoParaAgendaConsultorio/' + pIdRecurso + "/" + pIdTipoRecurso + "/" + pIdServicio + "/" + pIdSucursal + "/" +
        pFecha + "/" + pMostrarCancelados + "/" + pIncluirDemoraSala  + "/" + pIncluirDemoraTurnos + "/" + pIncluirConfirmacion + "/" + pIncluirMutualFacturada;
    return this.DtoService.Get(_url);
    }

    obtenerCalendarioDisponibilidadGeneral(pIdRecurso: number, pIdTipoRecurso: number, pIdServicio: number, pIdSucursal: number, fechaDesde: string, fechaHasta: string, soloAgendaActiva: boolean){
        var _url = 'DisponibilidadDeTurnos/ObtenerCalendarioDisponibilidadGeneral/' + pIdRecurso + "/" + pIdTipoRecurso + "/" + pIdServicio + "/" + pIdSucursal + "/" +
        fechaDesde + "/" + fechaHasta + "/" + soloAgendaActiva;
    return this.DtoService.Get(_url);
    }

    obtenerTurnosPorRecurso(filtroObtenerTurnosPorRecursoDTO: FiltroObtenerTurnosPorRecursoDto){
        var _url = 'DisponibilidadDeTurnos/ObtenerTurnosPorRecurso';
        return this.DtoService.Post(_url, filtroObtenerTurnosPorRecursoDTO);
    }

    static serviceFactory(log, dtoService) {
        return new dataService(log, dtoService);
    }
}

dataService.serviceFactory.$inject = ['Logger', 'DtoService'];

export class DisponibilidadDeTurnosDataService {
    static init(ngModule: angular.IModule) {
        ngModule.factory('DisponibilidadDeTurnosDataService', dataService.serviceFactory)
    }
}