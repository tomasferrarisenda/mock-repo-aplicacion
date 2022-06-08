/**
 * @author 			jdelmastro
 * @description 	description
 */

export interface ITiposDeTurnosDataService {	
        obtenerTodos(): any;
        // obtenerParaPortalWeb(pIdRecurso: number, pIdTipoRecurso: number, pIdServicio: number, pIdSucursal: number): any;
        // obtenerParaPortalWeb(pIdServicio: number, pIdSucursal: number): any;
        obtenerParaPortalWeb(pIdServicio: number, pIdSucursal: number, pIdRecurso?: number, pIdTipoRecurso?: number): any;
}

export class TiposDeTurnosDataService implements ITiposDeTurnosDataService{

    constructor(private DotService, private AuthorizationService, private $log) {
		this.$log = this.$log.getInstance('TiposDeTurnosDataService');
		this.$log.debug('ON.-');
    }
    
    public obtenerTodos() {
        var _url = 'TiposDeTurnos/ObtenerTodos';
        return this.DotService.Get(_url, { isCachable: true });
    }

    public obtenerParaPortalWeb(pIdServicio: number, pIdSucursal: number, pIdRecurso?: number, pIdTipoRecurso?: number) {
        var _url = "";

        if (pIdRecurso && pIdTipoRecurso) {
             _url = 'TiposDeTurnos/ObtenerParaPortalWeb/' + pIdRecurso + '/' + pIdTipoRecurso + '/' + pIdServicio + '/' + pIdSucursal;
        } else {
            _url = 'TiposDeTurnos/ObtenerParaPortalWeb/' + pIdServicio + '/' + pIdSucursal;
        }

        return this.DotService.Get(_url);
    }

    static seviceFactory(DotService, AuthorizationService, $log) {
		return new TiposDeTurnosDataService(DotService, AuthorizationService, $log);
	}

        //     var _url = 'TiposDeTurnos/ObtenerParaPortalWeb/' + pIdRecurso + '/' + pIdTipoRecurso + '/' + pIdServicio + '/' + pIdSucursal;
        //     return this.DotService.Get(_url);
        // }

    // public obtenerParaPortalWeb(pIdRecurso: number, pIdTipoRecurso: number, pIdServicio: number, pIdSucursal: number) {
    //     var _url = 'TiposDeTurnos/ObtenerParaPortalWeb/' + pIdRecurso + '/' + pIdTipoRecurso + '/' + pIdServicio + '/' + pIdSucursal;
    //     return this.DotService.Get(_url);
    // }

    // public obtenerParaPortalWeb(pIdServicio: number, pIdSucursal: number) {
    //     var _url = 'TiposDeTurnos/ObtenerParaPortalWeb/' + pIdServicio + '/' + pIdSucursal;
    //     return this.DotService.Get(_url);
    // }
}


TiposDeTurnosDataService.seviceFactory.$inject = ['DotService', 'AuthorizationService', 'Logger'];

export default class {
	public static init(ngModule: any) {
		ngModule.factory('TiposDeTurnosDataService', TiposDeTurnosDataService.seviceFactory);
	}
}
