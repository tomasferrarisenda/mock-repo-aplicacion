/**
* @author: ppautasso
* @description: Controller para el reporte generico de turnos
* @type: Controller
**/
import * as angular from 'angular';
import { IDisponibilidadDeTurnosDataService } from '../../../common/services/DisponibilidadDeTurnosDataService';
import { FiltroReporteGenericoDeTurnosDto } from '../../../common/models';
import { IServicioMedicoCommonLogicService } from '../../../../basicos/servicios/common/services';

export class ReporteGenericoTurnosController implements angular.IController {

    tipoFecha: any;
    loading: boolean = false;
    fechaDesde: any = new Date();
    fechaHasta: any = new Date();
    tiposDeTurno: any;
    tiposEstadoTurno: any;
    sucursales: any;
    soloAgendaActiva: boolean = true;
    incluirTurnosLibres: boolean = false;
    prestaciones: Array<any> = [];
    mutual;
    codigoMutual;
    mutualesSeleccionadas: Array<any> = [];
    recurso;
    servicioMedico;
    sucursal;
    tipoTurno;
    paciente;
    especialidad;
    listaMutuales: any;
    estadosTurnos: any;
    soloActivos: boolean = false;
    data: any;
    filtroBusqueda: FiltroReporteGenericoDeTurnosDto = {};
    incluirObservacionBool: boolean = false;
    incluirMotivoDeCancelacionBool: boolean = false;
    filtroServicioMedico: boolean = false;
    filtroMutual: boolean = false;
    filtroPaciente: boolean = false;
    prestacionSeleccionada;

    serviciosSeleccionados;

    optionsObj = {
		ok: 'Si',
		cancel: 'No'
	};

    columnasTabla: Array<any> = this.configurarColumnas(false);   

    tiposDeFecha: any = [{
        Id: 1,
        Nombre: 'Fecha Turno'
    },
    {
        Id: 2,
        Nombre: 'Fecha Carga'
    }];

    // #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
    title = {
        name: '', // Desde la vista (HTML) se accede con vm.title.name
        icon: '' // Desde la vista (HTML) se accede con vm.title.icon
    };
    // mas propiedades ..

    // #endregion

    // #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
    // ID
    static $inject: Array<string> = ['Logger', '$q', 'PlantillaDataService', 'TurnoDataService', 'AsignacionTurnoLogicService',
        'ModalService', 'SucursalDataService', 'PrestacionGestionDataService', 'DisponibilidadDeTurnosDataService', 'moment',
        'AlertaService', 'ServicioMedicoCommonLogicService'];
    /**
    * @class ReporteGenericoTurnosController
    * @constructor
    */
    constructor(private $log: ILogger, private $q, private PlantillaDataService, private TurnoDataService, private AsignacionTurnoLogicService,
        private ModalService, 
        private SucursalDataService, private PrestacionGestionDataService, private DisponibilidadDeTurnosDataService: IDisponibilidadDeTurnosDataService, private moment,
        private AlertaService, private ServicioMedicoCommonLogicService:IServicioMedicoCommonLogicService) {
    }

    // #endregion

    // #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

    // Crea las columnas de la tabla, permitiendo configurar la visibilidad de las columnas de tipo y motivo de cancelación
    configurarColumnas(ptipoMotivoCancelacionVisible) {
        return [
            {
                label: "Fecha",
                field: "Fecha",
                order: 1,
                format: 'date',
            },
            {
                label: "Hora",
                field: "Hora",
                order: 2,
                classCell: 'ColorDuracionMultiple'
            },
            {
                label: "ST",
                field: "ST",
                order: 3
            },
            {
                label: "Estado",
                field: "Estado",
                order: 4,
            },
            {
                label: "Dur.",
                field: "Duracion",
                order: 5,
            },
            {
                label: "Recurso",
                field: "Recurso",
                order: 6,
            }, 
            {
                label: "Matricula",
                field: "Matricula",
                order: 7,
                visible: false
            }, 
            {
                label: "Id Servicio",
                field: "IdServicio",
                order: 8,
                visible: false
            },
            {
                label: "Servicio",
                field: "Servicio",
                order: 9
            },
            {
                label: "Sucursal",
                field: "Sucursal",
                order: 10
            },
            {
                label: "Paciente",
                field: "Paciente",
                order: 11
            },
            {
                label: "Tipo Doc",
                field: "TipoDoc",
                order: 12,
                
            },
            {
                label: "Numero Doc",
                field: "NumeroDoc",
                order: 13,
                
            },
            {
                label: "Codigo Mutual",
                field: "CodigoMutual",
                order: 14,
                visible: false
            },
            {
                label: "Financiador",
                field: "Mutual",
                order: 15
            },
            {
                label: "Tipo Turno",
                field: "TipoTurno",
                order: 16
            },
            {
                label: "Prestaciones",
                field: "Prestaciones",
                order: 17
            },
            {
                label: "Fecha Carga",
                field: "FechaCarga",
                order: 18,
                format: 'datetime'
            },
            {
                label: "Usuario Carga",
                field: "UsuarioCarga",
                order: 19
            },
            {
                label: "Tipo Usuario",
                field: "TipoUsuario",
                order: 20
            },
            {
                label: "Tipo Cancelación",
                field: "TipoCancelacion",
                order: 21,
                visible: ptipoMotivoCancelacionVisible
            },
            {
                label: "Motivo de Cancelación",
                field: "MotivoCancelacion",
                order: 22,
                visible: ptipoMotivoCancelacionVisible
            },
            {
                label: "Especialidad",
                field: "RecursoEspecialidad",
                order: 23,
            }
        ];

    }

    agregarMutual() {
        if (this.mutual) {
            if (!this.mutualesSeleccionadas.find(x => x.Id === this.mutual.Id)) {

                this.$log.debug('agregando mutual a la lista..', this.mutual);
                this.mutualesSeleccionadas.push(this.mutual);
                delete this.mutual;
            }
        }
    }

    quitarMutual(mutual) {
        if (mutual) {
            this.mutualesSeleccionadas = angular.copy(this.mutualesSeleccionadas.filter(x => x.Id !== mutual.Id));
        }
    }

    quitarServicio(servicio) {
        if (servicio) {
            this.serviciosSeleccionados = angular.copy(this.serviciosSeleccionados.filter(x => x.Id !== servicio.Id));
        }
    }

    cargarDatosPrestacion(pServicio) {

        //cargo las prestaciones para el servicio
        if (pServicio !== null) {
            this.ModalService.loadingOpen();
            this.PrestacionGestionDataService.getTodasPrestacionesXServicio(pServicio.IdSucursal || pServicio.Id)
                .then(pResults => {
                    this.$log.debug("getPrestacionesXServicioOk", pResults);
                    if (pResults.length !== 0) {
                        this.prestaciones = pResults;

                        var prestacionTodas = {
                            Id : 0,
                            Nombre : "TODAS",
                        };
                        // sucTodas.Id = 0;
                        // sucTodas.Nombre = "TODAS";
                        this.prestaciones.unshift(prestacionTodas);
                    } else {
                        //no tengo prestaciones, por ende no cargo ninguna o borro las que estaban ya puestas
                        this.prestaciones = [];
                    }
                    this.ModalService.loadingClose();
                }, pError => {
                    this.$log.error("getPrestacionesXServicioError", pError);
                    this.ModalService.loadingClose();
                });
        }
    }

    cargarSucursalesXServicio(servicioMedico) {
        if (servicioMedico) {
            this.ModalService.loadingOpen();
            this.SucursalDataService.obtenerSucursalesXServicio(servicioMedico.Id)
                .then(pResults => {
                    this.ModalService.loadingClose();
                    //agrego opcion de TODAS
                    let _todasSucursal = {
                        Nombre: "TODAS",
                        Id: 0
                    }
                    pResults.unshift(_todasSucursal);
                    this.sucursales = angular.copy(pResults);
                }, pError => {
                    this.ModalService.loadingClose();
                    this.$log.error('Error al obtener sucursales x servicio', pError);
                });
        }
    }

    limpiar(){
        delete this.data;
        delete this.recurso;
        delete this.servicioMedico;
        delete this.sucursal;
        delete this.paciente;
        delete this.especialidad;
        this.prestaciones.length = 0;
        this.mutualesSeleccionadas.length = 0;
        delete this.serviciosSeleccionados;
        this.filtroServicioMedico = false;
        this.filtroMutual = false;
        this.filtroPaciente = false;
    }

    buscar() {

        var _busqueda;
        var _prestacion;
        var vm = this;

        //tipos de busqueda:
        // = 1 => busqueda para todo el sanatorio (31 dias)
        // = 2 => busqueda para todo el servicio (365 dias)
        // = 3 => busqueda para un solo recurso (libre)
        var tipo_busqueda = 0;

        let _fechaDesde = angular.copy(this.moment(this.fechaDesde).format('MM-DD-YYYY'));
        let _fechaHasta = angular.copy(this.moment(this.fechaHasta).format('MM-DD-YYYY'));

        var diffDays = this.moment(this.fechaHasta).diff(this.moment(this.fechaDesde), 'days')
        if (diffDays > 365) tipo_busqueda = 3; //puedo buscar solamente cuando tengo recurso definido
        if (diffDays <= 365 && diffDays > 31) tipo_busqueda = 2; //puedo buscar si tengo un servicio definido 
        if (diffDays <= 31) tipo_busqueda = 1; //puedo buscar libremente

        let _recursoId;
        if (this.sucursal.Id == 0) {
            _recursoId = (this.recurso) ? this.recurso.Id : 0;
        } else { 
            _recursoId = (this.recurso) ? this.recurso.Id : 0;
        }
        let _tipoRecursoId = (this.recurso) ? this.recurso.IdTipoRecurso : 0;
        let _servicioId = (this.servicioMedico) ? this.servicioMedico.Id : 0;
        let _sucursalId = (this.sucursal) ? this.sucursal.Id : 0;
        let _pacienteId = (this.paciente) ? this.paciente.Id : 0;
        let _tipoTurnoId = (this.tipoTurno) ? this.tipoTurno.Id : 0;

        if (tipo_busqueda === 3 && _recursoId === 0) {
            this.AlertaService.NewWarning("Atención", "No se puede ejecutar esta consulta porque devuelve demasiados turnos. Revise las fechas Desde / Hasta: " +
                " - Para todo el Sanatorio: máximo 1 mes " +
                " - Para todo un Servicio: máximo 1 año " +
                " - Para un profesional: sin límites");
            return;
        }

        if (tipo_busqueda === 2 && (_servicioId === 0 && !this.existenServiciosSeleccionados())) {
            this.AlertaService.NewWarning("Atención", "No se puede ejecutar esta consulta porque devuelve demasiados turnos. Revise las fechas Desde / Hasta: " +
                " - Para todo el Sanatorio: máximo 1 mes " +
                " - Para todo un Servicio: máximo 1 año " +
                " - Para un profesional: sin límites");
            return;
        }

        //lista de mutuales
        let _listaMutuales: Array<any> = [];
        if (this.mutualesSeleccionadas && this.mutualesSeleccionadas.length > 0) {
            angular.forEach(this.mutualesSeleccionadas, (mutual) => {
                _listaMutuales.push(mutual.Id);
            })
        }

        //lista de servicios
        let _listaServicios: Array<any> = [];
        if (this.serviciosSeleccionados && this.serviciosSeleccionados.length > 0) {
            angular.forEach(this.serviciosSeleccionados, (servicio) => {
                _listaServicios.push(servicio.Id);
            })
        }

        //estado de turnos
        let _listaEstadoTurnos: Array<any> = [];
        if (this.tiposEstadoTurno && this.tiposEstadoTurno.length > 0) {
            angular.forEach(this.tiposEstadoTurno, (estado) => {
                if (estado.status)
                    _listaEstadoTurnos.push(estado.Id);
            })
        }
        if (_listaMutuales.length == 0) _listaMutuales.push(0);
        if (_listaServicios.length == 0) {
            // no tengo ningun servicio en filtro por servicios multiples 
            // debo consultar si tengo UN servicios seleccionado
            if (this.servicioMedico && this.servicioMedico.Id) {
                // tengo seleccionado un servicio en el selector
                // lo agrego a la busqueda
                _listaServicios.push(this.servicioMedico.Id);
            } else {
                // no tengo ningun servicio por lo que debo buscar sin servicios
                _listaServicios.push(0);
            }
        } else {
            // tengo una lista de servicios seleccionados
            // pero ademas tengo que ver si tengo un servicio en el selector
            // para agregarlo
            if (this.servicioMedico && this.servicioMedico.Id) {
                // tengo seleccionado un servicio en el selector
                // lo agrego a la busqueda pero consultando si no existe ya previamente
                if (!_listaServicios.find(x => x.Id === this.servicioMedico.Id))
                    _listaServicios.push(this.servicioMedico.Id);
            }
        }
        if (_listaEstadoTurnos.length == 0) _listaEstadoTurnos.push(0);

        //Prestaciones
        let _prestacionId = 0;
        angular.forEach(this.prestaciones, (prestacion) => {
            if (prestacion.status) _prestacionId = prestacion.Id;
        })

        this.filtroBusqueda = {};
        
        this.filtroBusqueda.FechaDesde = angular.copy(_fechaDesde);
        this.filtroBusqueda.FechaHasta = angular.copy(_fechaHasta);
        this.filtroBusqueda.IdRecurso = angular.copy(_recursoId);
        this.filtroBusqueda.IdTipoRecurso = angular.copy(_tipoRecursoId);
        this.filtroBusqueda.ListaDeEstadosDeTurnos = angular.copy(_listaEstadoTurnos);
        this.filtroBusqueda.ListaDeServicios = angular.copy(_listaServicios);
        this.filtroBusqueda.IdSucursal = angular.copy(_sucursalId);
        this.filtroBusqueda.IdPaciente = angular.copy(_pacienteId);
        this.filtroBusqueda.ListaDeMutuales = _listaMutuales;
        this.filtroBusqueda.IdTipoTurno = angular.copy(_tipoTurnoId);
        this.filtroBusqueda.SoloAgendaActiva = angular.copy(this.soloAgendaActiva);
        this.filtroBusqueda.SoloActivos = angular.copy(this.soloActivos);
        this.filtroBusqueda.IncluirObservaciones = angular.copy(this.incluirObservacionBool);
        this.filtroBusqueda.IncluirMotivoDeCancelacion = angular.copy(this.incluirMotivoDeCancelacionBool);
        this.filtroBusqueda.IdEspecialidad = (this.especialidad) ? angular.copy(this.especialidad.Id) : 0;
                
        this.columnasTabla.length = 0;
        this.columnasTabla = this.configurarColumnas(this.incluirMotivoDeCancelacionBool);
        // si tengo incluida la observacion la agrego nuevamente a la columna
        if (this.incluirObservacionBool) { 
            let _order = this.columnasTabla[this.columnasTabla.length - 1].order + 1;
                    this.columnasTabla.push( {
                        label: "Observación",
                        field: "Observaciones",
                        order: _order
                    });
        }
                
        if(this.prestacionSeleccionada && this.prestacionSeleccionada.Id){

            this.filtroBusqueda.IdPrestacion = angular.copy(this.prestacionSeleccionada.Id);
        }else this.filtroBusqueda.IdPrestacion = 0
        this.filtroBusqueda.IncluirLibres = angular.copy(this.incluirTurnosLibres);
       
        if (this.tipoFecha && this.tipoFecha.Id == 1){
            this.loading = true;
            //voy a buscar por fecha de atencion o fecha turno
            _busqueda = this.DisponibilidadDeTurnosDataService.obtenerReporteGenericoPorFechaDeAtencion(this.filtroBusqueda)
                .then(buscarOk, buscarError);

        } else if (this.tipoFecha && this.tipoFecha.Id == 2){
            this.loading = true;
            // voy a atneder por fecha de asignacion del turno o fecha carga
            _busqueda = this.DisponibilidadDeTurnosDataService.obtenerReporteGenericoPorFechaDeOtorgamiento(this.filtroBusqueda)
                .then(buscarOk, buscarError);
        }else {
            this.AlertaService.NewWarning("Debe seleccionar un Tipo de Fecha para buscar");
        }

        function buscarOk(pResponse) {

            vm.$log.debug('buscarOk', pResponse);
            if(pResponse && pResponse.length < 1){
                vm.AlertaService.NewWarning("Atención", "La busqueda no ha arrojado resultados");
                delete vm.data;
            }else {
                vm.data = angular.copy(pResponse);
                vm.connectData();
            }
            vm.loading = false;
            
        }

        function buscarError(pError) {
            vm.$log.error('buscarError', pError);
            vm.loading = false;
        }

    }

     // #endregion

    // #region /* --------------------------------------- SUPPORT ------------------------------------------ */

    loadPrestacionesBtn() {
        return this.AsignacionTurnoLogicService.loadPrestacionesButton(this.prestaciones);
    }

    existenServiciosSeleccionados(){
        if(this.serviciosSeleccionados && this.serviciosSeleccionados.length > 0) return true;
        else return false;
    }

    handleEventProp() {
        $('.dropdown-menu').click(function (e) {
            e.stopPropagation();
        });
    }

    connectData(){

        angular.forEach(this.data,(turno) =>{
            if (turno.Duracion.length > 0)
                turno.ColorDuracionMultiple = 'color-turno-duracion-multiple';
        });
    }

    incluirObservacion(){

        var dataExist = false;
        if(this.data && this.data.length){
            dataExist = true;
        }
        delete this.data;

        if(this.incluirObservacionBool){
            this.ModalService.confirm("Atención, si incluye la observación en la busqueda, el sistema se relentizará, desea incluir la observación de todas formas?'",
            (pResponse) => {

               if (!pResponse) {
                    this.incluirObservacionBool = false;
                    this.columnasTabla.filter(x => x.order !== 21);
               } else {
                   
                   let _order = this.columnasTabla[this.columnasTabla.length - 1].order + 1;
                   this.$log.debug('_order',_order);
                    this.columnasTabla.push( {
                        label: "Observación",
                        field: "Observaciones",
                        order: _order
                    });

                    if(dataExist) this.buscar();
                }


                let _data = angular.copy(this.columnasTabla);
                this.columnasTabla.length = 0;
                this.columnasTabla = angular.copy(_data);


           }, undefined, this.optionsObj);
        }
    }

    changeMotivoCancelacionBool() {
        if(this.data && this.data.length){
            this.buscar();
        }
    }

    setServicioId(){
        if(this.servicioMedico && !this.servicioMedico.Id){
            
            this.servicioMedico.Id = angular.copy(this.servicioMedico.IdServicio);
        }
    }

    disabledServicio(){
        let ret = true;
        if(this.sucursal){
            if(this.sucursal.Id === 0 || this.sucursal.Id === 1 || this.sucursal.Id === 2){
                ret = false;
            }
        }
        return ret;
    }

    disabledSucursal(){
        let ret = true;
        if(!this.disabledServicio()){
            if(this.servicioMedico && this.servicioMedico.Id){
                ret = false;
            }
        }
        return ret;
    }

    abrirSelectorServiciosMultiples(){
        this.ServicioMedicoCommonLogicService.openSelectorMultipleServicios(this.serviciosSeleccionados)
        .then( (pResult) => {
            this.$log.debug('pResult seleccionar multiples servicios',pResult);
            this.serviciosSeleccionados = angular.copy(pResult);
        }, (pError) => {
            this.$log.error('pError',pError);
        });
    }

    changeFiltroServicioMedico(){
        if(!this.filtroServicioMedico){
            // el filtro esta en false, por lo que limpiamos los items del filtro de servicio medico
            delete this.serviciosSeleccionados;
        }
    }

    // #endregion

    // #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

    /**
    * @class ReporteGenericoTurnosController
    * @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
    * @event
    */
    $onInit() {

        this.$log = this.$log.getInstance('ReporteGenericoTurnosController');
        this.$log.debug('ON');

        var _tiposDeTurnos = this.PlantillaDataService.obtenerTiposDeTurnos();
        var _tiposDeEstadoTurno = this.TurnoDataService.obtenerTiposEstadoTurnos();
        var _filtroBusqueda = this.DisponibilidadDeTurnosDataService.obtenerNuevoFiltroReporteGenericoDeTurnos();

        this.$q.all([_tiposDeTurnos, _tiposDeEstadoTurno, _filtroBusqueda
        ]).then(pResponse => {

            this.$log.debug('Inicializar datos y consulta...OK', pResponse);
            this.tiposDeTurno = pResponse[0];
            this.tiposEstadoTurno = pResponse[1];
            this.filtroBusqueda = pResponse[2];


            this.sucursales = [{
                Id : 0,
				Nombre : "TODAS",
            },{
                Id : 1,
				Nombre : "NUEVA CBA",
            },{
                Id : 2,
				Nombre : "CERRO",
            }]

            this.sucursal = {
                Id : 0,
				Nombre : "TODAS",
            };

            var prestacionTodas = {
                Id : 0,
                Nombre : "TODAS",
            };

            this.prestaciones.unshift(prestacionTodas);
            this.prestacionSeleccionada = {
                Id : 0,
                Nombre : "TODAS",
            }

            angular.forEach(this.tiposEstadoTurno, (estado) => {
                estado.status = true;
            });

        }, pError => {
            this.$log.error('Inicializar Datos y consulta... ERROR', pError);
        });

    }
    // #endregion
}