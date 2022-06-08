/**
* @author:         emansilla
* @description:    Servicio de datos de indicaciones suministradas
* @type:           Service
**/
import * as angular from 'angular';
import { IDtoService } from 'core/http';
import { IndicacionSuministradaReporteVista } from '../models';

export interface IIndicacionesSuministradasReporteDataService {
    obtenerPorFecha(fechaDesde: Date, fechaHasta: Date, idSucursal: number, numeroInternacion: number): angular.IPromise<IndicacionSuministradaReporteVista[]>;
}

class dataService implements IIndicacionesSuministradasReporteDataService {

    constructor(private $log: ILogger, private DtoService: IDtoService, private dateUtils: IDateUtils) {
        this.$log = this.$log.getInstance('IndicacionesSuministradasReporteDateService');
        this.$log.debug('ON');
    }

    obtenerPorFecha(fechaDesde: Date, fechaHasta: Date, idSucursal: number, numeroInternacion : number) {
        let fechaD = this.dateUtils.parseToBeParams(fechaDesde);
        let fechaH = this.dateUtils.parseToBeParams(fechaHasta);
        return this.DtoService
            .Get(`Farmacia/IndicacionSuministradaReporteVista/ObtenerPorFecha/${fechaD}/${fechaH}/${idSucursal}/${numeroInternacion}`);
    }

    static serviceFactory() {
        const service = (log, dtoService, dateUtils) => new dataService(log, dtoService, dateUtils);
        service.$inject = ['Logger', 'DtoService', 'DateUtils'];
        return service;
    }
}

export class IndicacionesSuministradasReporteDataService {
    static init(ngModule: angular.IModule) {
        ngModule.factory('IndicacionesSuministradasReporteDataService', dataService.serviceFactory())
    }
}