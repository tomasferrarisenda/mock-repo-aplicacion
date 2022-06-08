/**
* @author: ppautasso
* @description: controller para componente para impirmir reporte de informes por internado en farmacia
* @type: Controller
**/
import * as angular from 'angular';

export class FarmaciaImprimirInformesPorInternadoController implements angular.IController {

	// #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
	title = {
		name: '', // Desde la vista (HTML) se accede con vm.title.name
		icon: '' // Desde la vista (HTML) se accede con vm.title.icon
	};
	// mas propiedades ..
	resolve;
	dismiss;
	close;
	loading: boolean = false;
	data: any;
	// #endregion

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID
	static $inject: Array<string> = ['Logger'];
	/**
	* @class FarmaciaImprimirInformesPorInternadoController
	* @constructor
	*/
	constructor(private $log: ILogger) {
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */
	cancel() {
		this.dismiss({ $value: 'cancel' });
	}

	cerrar(value) {
		this.close({ $value: value });
	}

	tieneAltaEnfermeria(fechaAltaEnfermeria) {
		let ret = true;
		if (fechaAltaEnfermeria.includes("0001")) ret = false;
		return ret;
	}

	contieneAltoRiesgo(internado) {
		let ret = false;

		if(internado.Dosificaciones && internado.Dosificaciones.length){

			internado.Dosificaciones.forEach(dosi => {
				if (dosi.EsAltoRiesgo) ret = true;
			});
		}


		if(internado.Infusiones && internado.Infusiones.length){
			internado.Infusiones.forEach(infu => {
				if (infu.EsAltoRiesgo) ret = true;
			});
		}

		return ret;
	}


	todasAltoRiesgo(data){
		let ret = false;
		if(data.find(x => x.EsAltoRiesgo == false ))
		ret = true;
		return ret;
	}
	// #endregion

	// #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

	/**
	* @class FarmaciaImprimirInformesPorInternadoController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {
		this.$log = this.$log.getInstance('FarmaciaImprimirInformesPorInternadoController');
		this.$log.debug('ON');

		this.data = this.resolve.Data;
		setTimeout( ()  => { 
			window.print();
			this.cerrar(true) 
		}, 2500);
	}
	// #endregion
}