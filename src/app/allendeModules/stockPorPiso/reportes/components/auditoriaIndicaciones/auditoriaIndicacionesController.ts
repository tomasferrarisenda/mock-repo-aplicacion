/**
* @author:         emansilla
* @description:    Audiitoria de indicaciones
* @type:           Controller
**/
import * as angular from 'angular';
import { IIndicacionesSuministradasReporteDataService } from '../../services';

export class AuditoriaIndicacionesController implements angular.IController {

    title = {
        name : 'Indicaciones suministradas',
        icon : 'STATS'
    };

    today = new Date();
    fechaDesde: Date;
    fechaHasta: Date;
    sucursal: any;
    numeroInternacion : any;
    reporte: any;

    // ID
    static $inject: Array<string> = ['Logger', 'IndicacionesSuministradasReporteDataService'];
    /**
     * @class       AuditoriaIndicacionesController
     * @constructor
     * @description Se ejecuta cuand
     */
    constructor(private $log: ILogger, private indicacionSuministradaReporteDataService: IIndicacionesSuministradasReporteDataService){
        this.fechaDesde = new Date();
        this.fechaHasta = new Date();
    }

    reloadPage() {
        this.initFilters();
    }

    getReporte() : void {
        var nroInternacion = 0;
        if(this.numeroInternacion > 0) nroInternacion = this.numeroInternacion;
        this.indicacionSuministradaReporteDataService.obtenerPorFecha(this.fechaDesde, this.fechaHasta, this.sucursal.Id, nroInternacion)
        .then(r => {
            this.$log.debug(r);
            this.reporte = r;
        })
    }

    initFilters() {
        this.fechaDesde = new Date();
        this.fechaHasta = new Date();
    }

    /**
     * @class       AuditoriaIndicacionesController
     * @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
     * @event
    */
    $onInit() {
       this.$log = this.$log.getInstance('AuditoriaIndicacionesController');
       this.$log.debug('ON');
       this.initFilters();
    }
}