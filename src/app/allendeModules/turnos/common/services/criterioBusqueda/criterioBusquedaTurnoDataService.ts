/**
 * @author 			jdelmastro
 * @description 	description
 */

export interface ICriterioBusquedaTurnoDataService {
	obtenerTodos(): any;
	obtenerNuevoCriterioBusquedaRecursosDelServicio(): any;
	obtenerPartiendoDeUnTurno(pIdTurno): any;

}

export class CriterioBusquedaTurnoDataService implements ICriterioBusquedaTurnoDataService {

	constructor(private DotService, private AuthorizationService, private $log) {
		this.$log = this.$log.getInstance('CriterioBusquedaTurnoDataService');
		this.$log.debug('ON.-');
	}

	public obtenerTodos() {
		var _url = 'TiposDeTurnos/ObtenerTodos';
		return this.DotService.Get(_url, { isCachable: true });
	}

	public obtenerNuevoCriterioBusquedaRecursosDelServicio(){
		var _url = 'CriterioBusquedaRecursosDelServicio/ObtenerNuevo';
		return this.DotService.Get(_url);
	}

	public obtenerPartiendoDeUnTurno(pIdTurno){
		var _url = 'CriterioBusqueda/ObtenerPartiendoDeUnTurno/' + pIdTurno;
		return this.DotService.Get(_url);
	}


	static seviceFactory(DotService, AuthorizationService, $log) {
		return new CriterioBusquedaTurnoDataService(DotService, AuthorizationService, $log);
	}

}


CriterioBusquedaTurnoDataService.seviceFactory.$inject = ['DotService', 'AuthorizationService', 'Logger'];

export default class {
	public static init(ngModule: any) {
		ngModule.factory('CriterioBusquedaTurnoDataService', CriterioBusquedaTurnoDataService.seviceFactory);
	}
}
