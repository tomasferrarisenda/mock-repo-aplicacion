/**
* @author:         emansilla
* @description:    COmunicacion con back para ubicacion medica
* @type:           Service
**/
import * as angular from 'angular';
import { IDtoService } from 'core/http';

export interface IUbicacionMedicaDataService {
    getUbicacionMedicaByPiso(idPiso); // cambiar a minuscula
}

class dataService implements IUbicacionMedicaDataService {

    constructor(private $log: ILogger, private DtoService: IDtoService) {
        this.$log = this.$log.getInstance('UbicacionMedicaDateService');
        this.$log.debug('ON');
    }

    getUbicacionMedicaByPiso(pPiso) {
        var _url = 'UbicacionMedica/GetUbicacionMedicaByPiso/' + pPiso;
        return this.DtoService.Get(_url);
    }

    static serviceFactory(log, dtoService) {
        return new dataService(log, dtoService);
    }
}

dataService.serviceFactory.$inject = ['Logger', 'DtoService'];

export class UbicacionMedicaDataService {
    static init(ngModule: angular.IModule) {
        ngModule.factory('UbicacionMedicaDataService', dataService.serviceFactory)
    }
}