/**
 * @author 			jdelmastro
 * @description 	description
 */

export interface IItemsDePlantillaTurnoDataService {	
    obtenerPorId(pId): any;    
}

export class ItemsDePlantillaTurnoDataService implements IItemsDePlantillaTurnoDataService {

    constructor(private DotService, private AuthorizationService, private $log) {
        this.$log = this.$log.getInstance('ItemsDePlantillaTurnoDataService');
        this.$log.debug('ON.-');
    }

    public obtenerPorId(pId) {
        var _url = 'ItemPlantillaTurno/ObtenerPorId/' + pId;
        return this.DotService.Get(_url);
    }

    
    static seviceFactory(DotService, AuthorizationService, $log) {
        return new ItemsDePlantillaTurnoDataService(DotService, AuthorizationService, $log);
    }
   
}


ItemsDePlantillaTurnoDataService.seviceFactory.$inject = ['DotService', 'AuthorizationService', 'Logger'];


export default class {
    static init(ngModule: any) {
        ngModule.factory('ItemsDePlantillaTurnoDataService', ItemsDePlantillaTurnoDataService.seviceFactory);
    }
}
