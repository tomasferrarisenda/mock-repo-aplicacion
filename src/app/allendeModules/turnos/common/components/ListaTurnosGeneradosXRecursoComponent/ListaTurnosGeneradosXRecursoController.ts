/**
* @author: pablo pautasso
* @description: Controller para lista de turnos generados x recurso 
* @type: Controller
**/
import * as angular from 'angular';
import { IDisponibilidadDeTurnosDataService, DisponibilidadDeTurnosDataService } from '../../../common/services/DisponibilidadDeTurnosDataService';

export class ListaTurnosGeneradosXRecursoController implements angular.IController {

    resolve;
    dismiss;
    turnosGenerados: any;
    loading: boolean = false;
    estadosDeTurnos: any;
    tiposDeTurnos: any;
    serviciosXRecepcion: any;
    sucursales: any;
    tipoConsulta: any;
    reglasTurnos: any = "";
    menuOptions: any;
    user: any;
	permisoVerMotivoDeReceso: boolean = false;

    // ID
    static $inject: Array<string> = ['Logger', '$q', '$state', 'moment', 'DisponibilidadDeTurnosDataService', 'TurnoDataService', 'AlertaService',
        'PlantillaDataService', 'SucursalDataService', 'PlantillaLogicService', 'TurnosCommonLogicService', 
        'CredentialsDataService', 'MantenimientoAgendaAuthService'];
    // Constructor
    constructor(private $log: ILogger, private $q, private $state, private moment,
        private DisponibilidadDeTurnosDataService: IDisponibilidadDeTurnosDataService, private TurnoDataService, private AlertaService: IAlertaService, 
        private PlantillaDataService, private SucursalDataService, private PlantillaLogicService, private TurnosCommonLogicService,
        private CredentialsDataService, private MantenimientoAgendaAuthService
    ) {
    }

    title = {
        name: 'Lista De Turnos',
        icon: 'LIST'
    };

    $onInit() {

        this.$log = this.$log.getInstance('ListaTurnosGeneradosXRecursoController');
        this.$log.debug('ON');
        var vm = this;
        this.loading = true;

        this.user = this.CredentialsDataService.GetForce();
        this.permisoVerMotivoDeReceso = this.MantenimientoAgendaAuthService.puedeVerMotivoDeReceso(this.user);
        
        this.$log.debug('ON', this.resolve.CriterioBusqueda);
        // this.tipoConsulta = angular.copy(this.resolve.TipoConsulta);
        var _disponibilidadDeTurnos;
        _disponibilidadDeTurnos = this.DisponibilidadDeTurnosDataService.obtenerTurnosPorRecursoListaCompletaDelDia(this.resolve.CriterioBusqueda);
        var _estadosDeTurnos = this.TurnoDataService.obtenerTiposEstadoTurnos();
        var _tiposDeTurnos = this.PlantillaDataService.obtenerTiposDeTurnos();        
        var _sucursales = this.SucursalDataService.obtenerTodasSinExcepciones();


        this.$q.all([
            _disponibilidadDeTurnos,
            _estadosDeTurnos,
            _tiposDeTurnos,
            _sucursales
        ]).then((pResults) => {

            this.$log.debug('obteniendo resultados onInit', pResults);
            this.turnosGenerados = pResults[0];
            this.estadosDeTurnos = pResults[1];
            this.tiposDeTurnos = pResults[2];
            this.sucursales = pResults[3];
            this.setearData();
            this.loading = false;

            this.inicializarMenuOptions();

           
               //trngo reglas que no permiten visualizar los turnos disponibles en asignacion
                this.DisponibilidadDeTurnosDataService.obtenerTurnosDisponiblesConReglasExplicadas(this.resolve.CriterioBusqueda)
                    .then(response => {
                        this.$log.debug('response ObtenerReglaPorIdOk', response);
                        if (!angular.isUndefined(response.SituacionesPorDia[0].Reglas[0])){

                            // Object.keys(response.SituacionesPorDia[0].Reglas).map(e => {
                            //     console.log(`key= ${e} value = ${response.SituacionesPorDia[0].Reglas[e]}`)
                            // })

                            this.PlantillaDataService.obtenerReglaPorId(response.SituacionesPorDia[0].Reglas[0].Regla)
                                .then(pResponse => {
                                    this.$log.debug('pResponse ObtenerReglaPorIdOk', pResponse);
                                    this.reglasTurnos = pResponse.Descripcion;
                                }, error => {
                                    this.$log.error('error ObtenerReglaPorIdError', error);
                                });
                        }
                    }, error => {
                        this.$log.error('error ObtenerReglaPorIdError', error);
                    });
            

        }, (pError) => {
            this.$log.error('Error onInit', pError);
            this.loading = false;
        });

    }

    setearData() {

        angular.forEach(this.turnosGenerados, (turno, key) => {
            // turno.SobreTurno = (turno.EsSobreTurno) ? "SI" : "NO";
            turno.Asignable = (turno.EsAsignable) ? "SI" : "NO";
            turno.Estado = (this.estadosDeTurnos.find(x => x.Id === turno.IdEstado).Nombre) || "LIBRE";
            turno.TipoTurno = (this.tiposDeTurnos.find(x => x.Id === turno.IdTipoTurno).Nombre) || "";
            turno.Sucursal = (this.sucursales.find(x => x.Id === turno.IdSucursal).Nombre) || "";
            turno.ColorSucursal = (this.sucursales.find(x => x.Id === turno.IdSucursal).Color) || "";
            turno.EstadoColor = (this.estadosDeTurnos.find(x => x.Id === turno.IdEstado).Color) || "";
            turno.IdRow = angular.copy(key);
        });

        this.title.name = "Lista De Turnos del día: " + this.moment(this.resolve.CriterioBusqueda.FechaDesde).format("dddd, DD-MM-YYYY")
    }


    cancel() {
        this.dismiss({ $value: 'cancel' });
    }

    abrirReglasDeTurnos() {
        this.PlantillaLogicService.abrirReglasDeTurnos(this.resolve.CriterioBusqueda.IdServicio,
            this.resolve.CriterioBusqueda.IdRecurso, this.resolve.CriterioBusqueda.IdTipoRecurso)
    }

    asignarSobretrunoDNP() {

        this.$log.debug('asingarSobreTurnoDNP', this.resolve.CriterioBusqueda);
        var date = new Date();
        var moment = this.moment();

        this.$log.debug('date',date);
        this.$log.debug('moment', moment);

        var afiliacionPaciente = this.resolve.Paciente.Afiliaciones.find(x => x.PorDefecto == true);
        if(afiliacionPaciente){
            if (afiliacionPaciente.EsParticular)
            {
                let bloques = this.TurnosCommonLogicService.getBloquesListaTurnos(this.turnosGenerados, this.sucursales);
                this.$log.debug('bloques...', bloques);

                // var servicio = this.obtenerServicioPorId(this.recursosSeleccionados[0].IdServicio);
                var servicio = {
                    Id: this.resolve.CriterioBusqueda.IdServicio,
                    Nombre: this.resolve.CriterioBusqueda.Servicio
                }
                var recurso = {
                    Id: this.resolve.CriterioBusqueda.IdRecurso,
                    IdTipoRecurso: this.resolve.CriterioBusqueda.IdTipoRecurso,
                    Nombre: this.resolve.CriterioBusqueda.Recurso
                };

                var sucursal = this.sucursales.find(x => x.Id == this.resolve.CriterioBusqueda.IdSucursal);

                var paciente = angular.copy(this.resolve.Paciente);
                
                this.$log.debug("Antes de $state.go a DNP: fecha - servicio - recurso - sucursal", this.resolve.CriterioBusqueda.FechaDesde, servicio, recurso, sucursal);
                this.$state.go('recepcionturnos.asignarSobreturnoDNP', {
                    fecha: this.moment(this.resolve.Fecha),
                    servicio: servicio,
                    recurso: recurso,
                    sucursal: sucursal,
                    paciente: this.resolve.Paciente,
                    bloquesTurnos: bloques
                });

                this.dismiss({ $value: 'cancel' });
            }else this.AlertaService.NewWarning("Atención!", "DNP solo puede ser dado para obra social Particular")
        }

        
    }


    /* ---------------------------------------------- MENU CONTEXTUAL ---------------------------------------------- */
    inicializarMenuOptions() {
        this.menuOptions = [
            {
                text: 'Ver Motivo Cancelación',
                displayed: (modelValue)  => {
                    if (this.permisoVerMotivoDeReceso === false) return false;
                    
                    var ret = false;
                    if (modelValue.row.IdEstado === 6) ret = true;
                    return ret;

                },
                click: ($itemScope, $event, modelValue, text, $li) => {
                    this.$log.debug('item', $itemScope);
                    this.TurnosCommonLogicService.openMotivosCancelacionDeUnTurno($itemScope.row.Id);

                }
            },
            {
                text: 'Sin Acciones Disponibles',
                displayed: function (modelValue) {
                    
                    var ret = true;
                    if (modelValue.row.IdEstado === 6) ret = false;
                    return ret;
                },
                click: ($itemScope, $event, modelValue, text, $li) => {

                },
                enabled: false

            }
        ];
    }

}