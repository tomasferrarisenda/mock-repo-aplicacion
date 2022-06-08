/**
* @author: Pablo Pautasso
* @description: Controller para componente de lista de reglas
* @type: Controller
**/
import * as angular from 'angular';

export class ReglasDeTurnosConsultaController implements angular.IController {

	// #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
	title = {
		name: '', // Desde la vista (HTML) se accede con vm.title.name
		icon: '' // Desde la vista (HTML) se accede con vm.title.icon
	};
	// mas propiedades ..
	resolve;
	dismiss;
	data: any;
	columnasDuracion: any;
	columnasReglas: any;
	tabSelected: number = 0;
	loading: boolean = false;
	idServicio: number = 0;
	idRecurso: number = 0;
	idTipoRecurso: number = 0;
	// #endregion

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID
	static $inject: Array<string> = ['Logger', '$q', 'REGLAS_TABS', 'PlantillaDataService'];
	/**
	* @class ReglasDeTurnosConsultaController
	* @constructor
	*/
	constructor(private $log: ILogger, private $q, private REGLAS_TABS, private PlantillaDataService) {
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */


	// #endregion

	// #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

	/**
	* @class ReglasDeTurnosConsultaController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {
		this.$log = this.$log.getInstance('ReglasDeTurnosConsultaController');
		this.$log.debug('ON RESOLVE: ', this.resolve);

		this.idServicio = angular.copy(this.resolve.IdServicio);
		this.idRecurso = angular.copy(this.resolve.IdRecurso);
		this.idTipoRecurso = angular.copy(this.resolve.IdTipoRecurso);
		this.setColumns();
	}

	cancel() {
		this.dismiss({ $value: 'cancel' });
	}

	changeTab(tab) {
		this.$log.debug('cambie tab', tab);
		//consulto datos dependiendo el tab que levanto
		let dataEnd;
		this.loading = true;
		this.tabSelected = angular.copy(tab.Id);

		switch (tab.Id) {
			case 1: //caso 1 levanto REGLA DURACION TURNOS
				dataEnd = this.PlantillaDataService.obtenerDuracionesPorServicioEnRecurso(
					this.idServicio, this.idRecurso, this.idTipoRecurso);
				break;
			case 2://caso 2 levanto REGLA DE TURNOS
				dataEnd = this.PlantillaDataService.obtenerReglasPorServicioEnRecurso(
					this.idServicio, this.idRecurso, this.idTipoRecurso, 1);
				break;
			case 3://caso 3 levanto REGLA DE SOBRETURNOS
				dataEnd = this.PlantillaDataService.obtenerReglasPorServicioEnRecurso(
					this.idServicio, this.idRecurso, this.idTipoRecurso, 2);
				break;
		}

		this.$q.all([dataEnd])
			.then(pResults => {
				this.$log.debug('getDataOK', pResults[0]);
				this.data = [];
				this.data = pResults[0];
				angular.forEach(this.data, (row) => {
					if (this.tabSelected == 1) {
						row.Edad = this.getEdadDuracion(row);
					}else if(this.tabSelected == 2 || this.tabSelected == 3){
						row.Atiende = (row.Atiende) ? 'Si' : 'No Atiende';
					}
				})
				this.loading = false;
			}, pError => {
				this.$log.error('getDataError', pError);
				this.loading = false;
			});

	}

	setColumns() {

		this.columnasDuracion = [
			{ field: "DuracionConjunta", label: "Duración Conjunta", classCol: "text-center" },
			{ field: "DuracionIndividual", label: "Duración Individual", classCol: "text-center" },
			{ field: "Edad", label: "Edad", classCol: "text-center" },
			{ field: "Prestacion", label: "Prestación", classCol: "text-center" },
			{ field: "TipoTurno", label: "Tipo De Turno", classCol: "text-center" },
		];

		this.columnasReglas = [
			{ field: "CantidadMaxima", label: "Cant. Máxima", classCol: "text-center" },
			{ field: "Atiende", label: "Atiende", classCol: "text-center" },
			{ field: "DiaSemana", label: "Día de la Semana", classCol: "text-center" },
			{ field: "Sucursal", label: "Sucursal", classCol: "text-center" },
			{ field: "TipoTurno", label: "Tipo De Turno", classCol: "text-center" },
			{ field: "Prestacion", label: "Prestación", classCol: "text-center" },
			{ field: "TipoPrestacion", label: "Tipo de Prestación", classCol: "'text-center'" },
			{ field: "DimensionMutual", label: "Grupo / Mutual / Plan Mutual", classCol: "'text-center'" },
			// { field: "Mutual", label: "Mutual", classCol: "'text-center'" },
		];


	}

	getEdadDuracion(duracion) {

		if (duracion.FiltrarEdad) return "De: " + duracion.FiltrarEdadMinima + " a " + duracion.FiltrarEdadMaxima;
		else return "-";
	}


	// #endregion
}