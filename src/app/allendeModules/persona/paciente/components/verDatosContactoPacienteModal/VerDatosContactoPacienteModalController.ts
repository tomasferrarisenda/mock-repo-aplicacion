/**
* @author: ppautasso
* @description: controller para componente tipo modal para ver los datos de contacto del paciente
* @type: Controller
**/
import * as angular from 'angular';
import { IPacienteDataService } from '../../services';

export class VerDatosContactoPacienteModalController implements angular.IController {

	// #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
	title = {
		name: '', // Desde la vista (HTML) se accede con vm.title.name
		icon: '' // Desde la vista (HTML) se accede con vm.title.icon
	};
	// mas propiedades ..
	loading: boolean = false;
	dismiss;
	close;
	resolve;

	idPaciente: number = 0;
	paciente: any;
	// #endregion

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID
	static $inject: Array<string> = ['Logger', 'PacienteDataService', 'AlertaService'];
	/**
	* @class VerDatosContactoPacienteModalController
	* @constructor
	*/
	constructor(private $log: ILogger, private PacienteDataService:IPacienteDataService, private AlertaService) {
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

	cancel() {
		this.dismiss({ $value: 'cancel' });
	}

	buscarPaciente(){
		if(this.idPaciente != 0){
			
			this.loading = true;
			this.PacienteDataService.obtenerPacientePorIdSelector(this.idPaciente)
			.then( (pResult) => {
				this.$log.debug('pResult',pResult);
				this.paciente = pResult;

				this.title.name = "Datos Contacto Paciente: " + this.paciente.NombreCompleto + ". " + 
				this.paciente.TipoDocumento + ": " + this.paciente.NumeroDocumento;
				this.loading = false;
			}, (pError) => {
				this.$log.error('pError',pError);
				this.loading = false;
			});

		}
	}

	copiar(entidad){

		this.$log.debug('entidad',entidad);
		document.execCommand("copy", undefined, "hola");
		this.AlertaService.NewSuccess("Copiado!");
	}

	copiarCodigo(id) {
		let copyText: any = document.getElementById(id);
		if (copyText) {
			copyText.select();
			document.execCommand("copy");
			this.AlertaService.NewSuccess("Copiado!");
		}
	}
	// #endregion

	// #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

	/**
	* @class VerDatosContactoPacienteModalController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {
		this.$log = this.$log.getInstance('VerDatosContactoPacienteModalController');
		this.$log.debug('ON');

		this.idPaciente = this.resolve.IdPaciente;
		this.buscarPaciente();
	}
	// #endregion
}