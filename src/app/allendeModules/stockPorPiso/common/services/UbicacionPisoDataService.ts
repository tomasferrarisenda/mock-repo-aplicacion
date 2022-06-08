/**
* @author:         emansilla
* @description:    Datos de UbicacionPiso
* @type:           Service
**/
import * as angular from 'angular';
import { IDtoService } from 'core/http';

export interface IUbicacionPisoDataService {
    getUbicacionPorPisoYUbicacionMedica(pPiso, pUbicacion);
    getAllUbicacionesPiso();
    getUbicacionPisoByUbicacion(pUbicacion);
}

class dataService implements IUbicacionPisoDataService {

    constructor(private $log: ILogger, private DtoService: IDtoService) {
        this.$log = this.$log.getInstance('UbicacionPisoDateService');
        this.$log.debug('ON');
    }

    public getUbicacionPorPisoYUbicacionMedica(pPiso, pUbicacion) {
    var _url = 'UbicacionPiso/GetUbicacionByPisoAndUbicacionMedica/' + pPiso + '/' + pUbicacion;
    return this.DtoService.Get(_url);
    }

    public getAllUbicacionesPiso() {
    var _url = 'UbicacionPiso/';
    return this.DtoService.Get(_url);
    }

    public getUbicacionPisoByUbicacion(pUbicacion) {
    var _url = 'UbicacionPiso/GetOneByIdUbicacion/' + pUbicacion;
    return this.DtoService.Get(_url);
    }

    static serviceFactory(log, dtoService) {
        return new dataService(log, dtoService);
    }
}

dataService.serviceFactory.$inject = ['Logger', 'DtoService'];

export class UbicacionPisoDataService {
    static init(ngModule: angular.IModule) {
        ngModule.factory('UbicacionPisoDataService', dataService.serviceFactory)
    }
}