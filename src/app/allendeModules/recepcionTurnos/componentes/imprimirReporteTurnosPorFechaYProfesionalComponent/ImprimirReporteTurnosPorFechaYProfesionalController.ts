/**
* @author: ppautasso
* @description: controller para la impresion de turnos por fecha y profesional
* @type: Controller
**/
import * as angular from 'angular';

export class ImprimirReportePorFechaYProfesionalController implements angular.IController {

	// #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
	title = {
		name: '', // Desde la vista (HTML) se accede con vm.title.name
		icon: '' // Desde la vista (HTML) se accede con vm.title.icon
	};

	resolve;
	dismiss;
	loading: boolean = false;
	data: any;
	observaciones: any;
	fecha: any;
	recurso: any;
	reporteCompleto: any;
	sucursal: any;
	// mas propiedades ..

	// #endregion

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID
	static $inject: Array<string> = ['Logger'];
	/**
	* @class ImprimirReportePorFechaYProfesionalController
	* @constructor
	*/
	constructor(private $log: ILogger) {
	}
	

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

	cancel() {
		this.dismiss({ $value: 'cancel' });
	}


	obtenerObservacionSinTags(sucursal, observacion){

		let ret = '';
		let mC, mN;	

		if(sucursal.Id === 1){
			//tenemos nueva cordoba, extraemos de nueva cordoba
			const regexNvaCba = /\<nuevacba>(.*?)\<\/nuevacba>/g;
			let strNueva = angular.copy(observacion.replace(/\n/g, '<br>'));
			mN = regexNvaCba.exec(strNueva);
			if (mN !== null) {
				ret = mN[1];
			}

		}else if(sucursal.Id === 2){
			//tenemos obs del cerro, extraemos de cerro
			const regexCerro = /\<cerro>(.*?)\<\/cerro>/g;
			let strCerro = angular.copy(observacion.replace(/\n/g, '<br>'));
			mC = regexCerro.exec(strCerro);
			if (mC !== null) {
				ret = mC[1];
			}
		}
	
		ret = ret.replace(/<br>/g, '\n');
		return ret;
	}
	// #endregion

	// #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

	/**
	* @class ImprimirReportePorFechaYProfesionalController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {
		this.$log = this.$log.getInstance('ImprimirReportePorFechaYProfesionalController');
		this.$log.debug('ON');
		this.data = angular.copy(this.resolve.Data);
		this.sucursal = angular.copy(this.resolve.Sucursal);
		this.observaciones = this.obtenerObservacionSinTags(this.sucursal, this.resolve.Observaciones[0].Observaciones);
		this.fecha = angular.copy(this.resolve.Fecha);
		this.recurso = angular.copy(this.resolve.Recurso);
		this.reporteCompleto = angular.copy(this.resolve.ReporteCompleto);

		setTimeout( ()  => { 
			window.print();
			this.cancel() 
		}, 200);
	}
	// #endregion
}