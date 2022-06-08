/**
* @author: ppautasso
* @description: Controller para Componente para modal de cancelar turno
* @type: Controller
**/
import * as angular from 'angular';

export class CancelarTurnoController implements angular.IController {

    // #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
    title = {
        name: '', // Desde la vista (HTML) se accede con vm.title.name
        icon: '' // Desde la vista (HTML) se accede con vm.title.icon
    };
    // mas propiedades ..
    resolve;
    dismiss;
    close;
    motivosCancelacionTurno;
    turno;
    loading: boolean = false;
    motivoCancelacionTurno;
    observacionesParaEliminar;
    // #endregion

    // #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
    // ID
    static $inject: Array<string> = ['Logger', 'TurnoDataService', 'AlertaService'];
    /**
    * @class CancelarTurnoController
    * @constructor
    */
    constructor(private $log: ILogger, private TurnoDataService, private AlertaService: IAlertaService) {
    }

    // #endregion

    // #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

    cancelarTurnoOk(){
        this.loading = true;
        this.$log.error('cancelar turno', this.turno);

        var cancelarTurnoDto={
            IdTurno: this.turno.Id,
            IdMotivoDeAnulacionTurno: this.motivoCancelacionTurno,
            Observaciones: this.observacionesParaEliminar
         }

        this.TurnoDataService.cancelarTurnoPaciente(cancelarTurnoDto)
            .then((pResponse) => {
                this.$log.debug('pResponde Cancelar turno',pResponse);
                if(pResponse.IsOk){

                    this.AlertaService.NewSuccess("Turno Anulado");
                    this.close({ $value: true });
                }else {
                    this.AlertaService.NewWarning("No se pudo cancelar el turno " + pResponse.Message);
                }
                
                this.loading =false;
            },  (pError) =>{
                this.$log.error('pError Cancelar turno',pError);
                this.cancel();
            });

    }

    cancel(){
        this.dismiss({ $value: 'cancel' });
    }
     // #endregion

    // #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

    /**
    * @class CancelarTurnoController
    * @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
    * @event
    */
    $onInit() {
        this.$log = this.$log.getInstance('CancelarTurnoController');
        this.$log.debug('ON');
        this.turno = angular.copy(this.resolve.Turno);
        this.$log.debug('turnoObtenidoACancelar',this.turno);

        this.title.name = "ANULAR TURNO: Paciente: " + this.turno.Paciente + ". " + this.turno.Hora + " Hs."; 

        var _motivosCancelacionTurnos = this.TurnoDataService.obtenerMotivosCancelacionTurno()
        .then( (motivosCancelacionOK) => {

            this.$log.debug('movitosCancelacionOK', motivosCancelacionOK);
            this.motivosCancelacionTurno = angular.copy(motivosCancelacionOK);
        }, (motivosCancelacionError) => {
            this.$log.error('motivosCancelacionError', motivosCancelacionError);
        })
    }
    // #endregion
}