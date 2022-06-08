/**
* @author: Pablo pautasso
* @description: Controller para el componente de observaciones de sucursales
* @type: Controller
**/
import * as angular from 'angular';

export class ObservacionPorSucursalesController implements angular.IController {

	// #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
	resolve;
	dismiss;
	close;
	sucursales: any;
	data: any;
	title = {
		name : "Observaciones"
	};

	disabled: boolean = false;
	btnGuardar: boolean = true;



	// #endregion

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID
	static $inject: Array<string> = ['Logger'];
	/**
	* @class ObservacionPorSucursalesController
	* @constructor
	*/
	constructor(private $log: ILogger) {
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */
	cancel() {
		this.dismiss({ $value: 'cancel' });
	}

	guardar(){
		//voy a guardar las sucursales con la observacion pero tipandolas
		//<nuevacba></nuevacba> <cerro></cerro>
		this.armarObservacionesConSucursal();
		this.close({ $value: this.data});
	}

	// #endregion

	// #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

	/**
	* @class ObservacionPorSucursalesController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {
		this.$log = this.$log.getInstance('ObservacionPorSucursalesController');
		this.$log.debug('ON');

		this.sucursales = angular.copy(this.resolve.Sucursales);
		this.data = angular.copy(this.resolve.Data);
		this.disabled = angular.copy(this.resolve.Readonly);
		this.btnGuardar = angular.copy(this.resolve.BtnGuardar);

		if (this.data.observacionConTags !== ""){
			angular.forEach(this.sucursales, (sucursal) => {
				sucursal.Observacion = this.obtenerObservacionSinTags(sucursal, this.data.observacionConTags);
			});
		}

	}
	// #endregion

	armarObservacionesConSucursal(){

		let observacionToShow = '';
		this.data.observacionToShow = '';
		this.data.observacionConTags = '';

		angular.forEach(this.sucursales, (sucursal) => {
			
			if(sucursal.Nombre.toLowerCase().includes("nueva"))
			{
				sucursal.observacionToShow = sucursal.Observacion
				sucursal.observacionConTags = "<nuevacba>" + sucursal.Observacion + "</nuevacba>";
			} else if (sucursal.Nombre.toLowerCase().includes("cerro"))
			{
				sucursal.observacionToShow = sucursal.Observacion;
				sucursal.observacionConTags = "<cerro>" + sucursal.Observacion + "</cerro>"
			}

			this.data.observacionToShow = this.data.observacionToShow + '  ' + sucursal.observacionToShow;
			this.data.observacionConTags = this.data.observacionConTags + sucursal.observacionConTags;
			
		});
		
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

}