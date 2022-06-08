import { IDtoService } from "core/http";


export class LoggerDataService {

    constructor(private dtoService: IDtoService) {
    }

    log(object) {
        this.dtoService.Post("Logger/Error", object);
    }

    static seviceFactory(dtoService) {
        return new LoggerDataService(dtoService);
    }
}

LoggerDataService.seviceFactory.$inject = ['DtoService'];

export default class {
    static init(ngModule: any) {
        ngModule.factory('LoggerDataService', LoggerDataService.seviceFactory);
    }
}