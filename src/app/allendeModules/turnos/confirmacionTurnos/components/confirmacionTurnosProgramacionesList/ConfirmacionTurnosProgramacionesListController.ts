/**
* @author: ppautasso
* @description: controller para programaciones list component en confirmacion de turnos
* @type: Controller
**/
import * as angular from 'angular';
import { IProgramacionDeConfirmacionDataService, IConfirmacionTurnosLogicService } from '../../services';

export class ConfirmacionTurnosProgramacionesListController implements angular.IController {

	// #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
	title = {
		name: '', // Desde la vista (HTML) se accede con vm.title.name
		icon: '' // Desde la vista (HTML) se accede con vm.title.icon
	};
	// mas propiedades ..
	loading: boolean = false;
	programaciones;

	columnasProgramaciones = [
        {
            label: "Id",
            field: "Id",
            order: 1,
        },
        {
			label: "Tipo De Comunicación",
            field: "TipoDeComunicacion",
            order: 2,
		},
		{
            label: "Horas De Anticipación",
            field: "HorasDeAnticipacion",
            order: 3,
		},
		{
            label: "Excepciones",
            field: "ExcepcionesParsed",
			order: 4,
			type: 'text',
			format: 'html'
        }];
	// #endregion

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID
	static $inject: Array<string> = ['Logger', 'ProgramacionDeConfirmacionDataService', 'ConfirmacionTurnosLogicService'];
	/**
	* @class ConfirmacionTurnosProgramacionesListController
	* @constructor
	*/
	constructor(private $log: ILogger, private ProgramacionDeConfirmacionDataService: IProgramacionDeConfirmacionDataService,
		private ConfirmacionTurnosLogicService: IConfirmacionTurnosLogicService) {
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

	buscar(){

		this.loading = true;
		this.ProgramacionDeConfirmacionDataService.getAll()
		.then( (pResult) => {
			this.$log.debug('pResult',pResult);
			this.programaciones = pResult;

			this.programaciones.forEach(programacion => {
				programacion.Excepciones.forEach(excepcion => {
					if(!programacion.ExcepcionesParsed) programacion.ExcepcionesParsed = "";
					programacion.ExcepcionesParsed = programacion.ExcepcionesParsed + excepcion + "<br>";
				});
			});
			this.loading = false;
		}, (pError) => {
			this.$log.error('pError',pError);
			this.loading = false;
		});

	}

	verExcepciones(row){
		this.$log.debug('verExcepciones',row.row);
		this.ConfirmacionTurnosLogicService.openVerExcepcionesConfirmacion(row.row.Id);

	}

	// #endregion

	// #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

	/**
	* @class ConfirmacionTurnosProgramacionesListController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {
		this.$log = this.$log.getInstance('ConfirmacionTurnosProgramacionesListController');
		this.$log.debug('ON');

		this.buscar();
	}
	// #endregion
}