/**
 * @author 			jdelmastro
 * @description 	description
 */

export interface ITurnosDataService {	
    //obtenerTodos(): any;
    //obtenerParaPortalWeb(pIdServicio: number, pIdSucursal: number, pIdRecurso?: number, pIdTipoRecurso?: number): any;

    obtenerNuevoSobreturnoDnpDto(): any,
    validarAsignarSobreTurnoDNP(pSobreTurnoDnpDTO: any): any,
    asignarSobreTurnoDNP(pSobreTurnoDnpDTO: any): any
}

export class TurnosDataService implements ITurnosDataService {
    
    constructor(private DotService, private AuthorizationService, private $log) {
        this.$log = this.$log.getInstance('TurnosDataService');
        this.$log.debug('ON.-');
    }
    
    public obtenerNuevoSobreturnoDnpDto() {
        var _url = 'Turnos/ObtenerNuevoSobreturnoDnpDto';
        return this.DotService.Get(_url);
    }

    public validarAsignarSobreTurnoDNP(pSobreTurnoDnpDTO) {
        var _url = 'Turnos/ValidarAsignarSobreTurnoDNP';        
        return this.DotService.Post(_url, pSobreTurnoDnpDTO);
    }

    public asignarSobreTurnoDNP(pSobreTurnoDnpDTO) {
        var _url = 'Turnos/asignarSobreTurnoDNP';        
        return this.DotService.Post(_url, pSobreTurnoDnpDTO);
    }

    static seviceFactory(DotService, AuthorizationService, $log) {
        return new TurnosDataService(DotService, AuthorizationService, $log);
    }

}

TurnosDataService.seviceFactory.$inject = ['DotService', 'AuthorizationService', 'Logger'];

export default class {
	public static init(ngModule: any) {
		ngModule.factory('TurnosDataService', TurnosDataService.seviceFactory);
	}
}


/*

ObtenerNuevoTurnoAsignable
ObtenerNuevoAsignarTurnoSimpleDto
ObtenerNuevoAsignarTurnoMultipleDto
ObtenerNuevoReprogramarTurnoSimpleDto
ObtenerNuevoReprogramarTurnoMultipleDto
ObtenerNuevoSobreturnoDnpDto

ObtenerPorId/{idTurno}
Post ValidarAsignar(AsignarTurnoSimpleDTO asignarTurnoSimpleDto)
Post Asignar(AsignarTurnoSimpleDTO asignarTurnoSimpleDto
Post EvaluarTurnoContraConvenio(AsignarTurnoSimpleDTO asignarTurnoSimpleDto)
Post ReprogramarTurnoSimpleManualmente(ReprogramarTurnoSimpleDTO reprogramarTurnoSimpleDto)
Post ValidarAsignarMultiples(AsignarTurnoMultipleDTO asignarTurnoMultipleDto)
Post AsignarTurnoMultiple(AsignarTurnoMultipleDTO asignarTurnoMultipleDto)
    Post ValidarAsignarSobreTurnoDNP(SobreTurnoDnpDTO sobreturnoDto)
    Post AsignarSobreTurnoDNP(SobreTurnoDnpDTO sobreturnoDto)
Post ReprogramarTurnoMultipleManualmente(ReprogramarTurnoMultipleDTO reprogramarTurnoMultipleDto)

CancelarTurno(int idTurno, int idMotivoDeAnulacionTurno, string observaciones)
ObtenerTurnosPorPaciente(int idPaciente, DateTime fechaDesde, DateTime fechaHasta, int idServicio = 0)

Receptar(int idTurno)
ValidarReceptar(int idTurno)

AnularRecepcion(int idTurno)
ValidarAnularRecepcion(int idTurno)

IniciarAtencion(int idTurno)
ValidarIniciarAtencion(int idTurno)

AnularInicioAtencion(int idTurno)
ValidarAnularInicioAtencion(int idTurno)

FinalizarAtencion(int idTurno)
ValidarFinalizarAtencion(int idTurno)

AnularFinalizarAtencion(int idTurno)
ValidarAnularFinalizarAtencion(int idTurno)


ValidarDesistirDeReprogramar(int idTurno)
DesistirDeReprogramar(int idTurno)

ValidarCancelarDesisteDeReprogramar(int idTurno)
CancelarDesisteDeReprogramar(int idTurno)


ObtenerTurnosCancelados(DateTime fechaDesde, DateTime fechaHasta, int idServicio, int idRecurso, int idTipoRecurso, bool soloPendientes)
ObtenerTurnosCanceladosGrilla(DateTime fechaDesde, DateTime fechaHasta, int idServicio, int idRecurso, int idTipoRecurso, bool soloPendientes, int currentPage, int pageSize)
ObtenerTurnosCancelados(DateTime fechaDesde, DateTime fechaHasta, int idServicio, bool soloPendientes)
ObtenerTurnosCanceladosGrilla(DateTime fechaDesde, DateTime fechaHasta, int idServicio, bool soloPendientes, int currentPage, int pageSize)
ObtenerTurnosCancelados(DateTime fechaDesde, DateTime fechaHasta, bool soloPendientes)
ObtenerTurnosCanceladosGrilla(DateTime fechaDesde, DateTime fechaHasta, bool soloPendientes, int currentPage, int pageSize)




*/
