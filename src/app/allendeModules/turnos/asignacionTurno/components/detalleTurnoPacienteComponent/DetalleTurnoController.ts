import * as angular from 'angular';

export class DetalleTurnoController implements angular.IController {

    static $inject: Array<string> = ['Logger', 'moment', '$timeout'];

    pacienteConTurnos:any;
    turnosToShow: Array<any> = [];

    /* ------------------------------------------------ VARIABLES ------------------------------------------------ */
    // Constructor
    constructor(private $log: ILogger, private moment, private $timeout) {

        this.$log = this.$log.getInstance('DetalleTurnoController');
    }

    public getFechaConFormato(fecha: object): any {

       return this.moment(fecha).format('dddd DD [de] MMMM [de] YYYY');
    }

    public getDataPaciente(): any {

        
        if (this.pacienteConTurnos)
        return this.pacienteConTurnos.NombreCompleto + ' - ' + this.pacienteConTurnos.Edad + ' Años ' + ' - ' 
        + this.pacienteConTurnos.TipoDocumento + ': ' + this.pacienteConTurnos.NumeroDocumento; 
        else return 'No se encontro el paciente';

    } 

    public parseTurnos(_this): any{

        //recorro lista de turnos obtenidos
        angular.forEach(_this.pacienteConTurnos.Turnos, function (turno) {
            if (_this.turnosToShow.length === 0){
                _this.turnosToShow.push(turno);
            }else {
                if (!_this.turnosToShow.find(x => x.IdGrupoTurno === turno.IdGrupoTurno)){
                    _this.turnosToShow.push(turno);
                }
            }
        });
    }

    /* ------------------------------------------------- ACTIVATE ------------------------------------------------- */

    $onInit() {

        this.$log.debug('Inicializar ON.-', this.pacienteConTurnos);
        //parseamos los turnos por si tenemos turnos con duracion mas grande
        this.$timeout(() => {
            this.parseTurnos(this);
        }, 400);
        
    }
}
