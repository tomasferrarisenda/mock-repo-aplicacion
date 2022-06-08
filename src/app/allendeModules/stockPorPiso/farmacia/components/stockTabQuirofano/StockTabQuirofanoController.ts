import { IUbicacionDataService, IMovimientoStockDataService, IMaterialDataService, IGrupoFarmaciaDataService } from '../../../common/services';

export class StockTabQuirofanoController {
	static $inject: Array<string> = ['Logger',
		'UbicacionDataService', 'MovimientoStockDataService', 'MaterialDataService', 'GrupoFarmaciaDataService',
		'StockFarmaciaLogicService',
		'AlertaService', '$q'];

	grupos: Array<any> = [];
	internados: Array<any> = [];
	materiales: Array<any> = [];
	materialesCargados: Array<any> = [];
	grupo: any;
	internado: any;
	producto: any;
	observaciones: string = '';
	materialSeleccionado: any;
	grupoCargado: boolean = false;
	internadoCargado: boolean = false;
	esReposicion: boolean = false;
	esExterno: boolean = false;
	cargarProducto: boolean = false;
	hayMaterialSeleccionado: boolean = false;
	hayMateriales: boolean = false;
	activate: any;

	constructor(
		private $log: ILogger,
		private UbicacionDataService: IUbicacionDataService,
		private MovimientoStockDataService: IMovimientoStockDataService,
		private MaterialDataService: IMaterialDataService,
		private GrupoFarmaciaDataService: IGrupoFarmaciaDataService,
		private StockFarmaciaLogicService: any,
		private AlertaService: any,
		private $q: any) { }

	public seleccionarReposicion() {
		var vm = this;
		vm.materialesCargados = [];
		vm.esExterno = false;
		vm.internado = '';
		vm.internadoCargado = false;
		vm.hayCargados();
	}

    /**
     * seleccionarExterno
     */
	public seleccionarExterno() {
		var vm = this;
		vm.materialesCargados = [];
		vm.esReposicion = false;
		vm.internado = '';
		vm.internadoCargado = false;
		vm.hayCargados();
	}

	public seleccionarGrupo() {
		var vm = this;
		vm.grupoCargado = false;
		if (vm.grupo.Nombre)
			vm.grupoCargado = true;
	}

    /**
     * seleccionarInternado
     */
	public seleccionarInternado() {
		var vm = this;
		vm.materialesCargados = [];
		vm.hayCargados();
		vm.internadoCargado = false;
		vm.$log.debug("internado", vm.internado)
		if (vm.internado.numero_internado)
			vm.internadoCargado = true;
	}

    /**
     * seleccionarProducto
     */
	public seleccionarProducto() {
		var vm = this;
		if (vm.producto.Id) {
			var material = {
				Id: 0,
				Cantidad: 0,
				Material: vm.producto
			}
			var existe = false;
			for (var i = 0; i < vm.materialesCargados.length; i++) {
				if (vm.materialesCargados[i].Material.Id == material.Material.Id)
					existe = true;
			}
			if (!existe)
				vm.materialesCargados.unshift(material);
		}
		vm.producto = '';
		vm.hayCargados();
		vm.nuevoProducto();
	}

    /**
     * nuevoProducto
     */
	public nuevoProducto() {
		this.cargarProducto = !this.cargarProducto;
	}


	public printGrupo() {
		// this.printPresupuesto(pDetalle);
	}

	public suma(material: any) {
		var vm = this;
		for (var i = 0; i < vm.materialesCargados.length; i++) {
			if (vm.materialesCargados[i].Id == material.Id && vm.materialesCargados[i].Material.Id == material.Material.Id) {
				vm.materialesCargados[i].Cantidad += 1;
				vm.materialesCargados[i].minimo = false;
			}
		}
	}

	public resta(material: any) {
		var vm = this;
		for (var i = 0; i < vm.materialesCargados.length; i++) {
			if (vm.materialesCargados[i].Id == material.Id && vm.materialesCargados[i].Material.Id == material.Material.Id) {
				vm.materialesCargados[i].Cantidad -= 1;
				if (vm.materialesCargados[i].Cantidad == 0) {
					vm.materialesCargados[i].minimo = true;
				}
			}
		}
	}

    /**
     * cargarGrupo
     */
	public cargarGrupo() {
		var vm = this;
		vm.GrupoFarmaciaDataService.getGrupoPorId(vm.grupo.Id)
			.then(function (grupo) {
				for (var i = 0; i < grupo.Materiales.length; i++) {
					var existe = false;
					for (var j = 0; j < vm.materialesCargados.length; j++) {
						if (vm.materialesCargados[j].Material.Id == grupo.Materiales[i].Material.Id)
							existe = true;
					}
					if (!existe)
						vm.materialesCargados.push(grupo.Materiales[i]);
				}
				vm.hayCargados();
			})

	}

	public hayCargados() {
		var vm = this;
		vm.hayMateriales = false;
		if (vm.materialesCargados.length > 0)
			vm.hayMateriales = true;
	}

    /**
     * cargar
     */
	public cargar() {
		var vm = this;
		var tipoDestino = 3;
		if (vm.esReposicion) tipoDestino = 9;
		if (vm.esExterno) tipoDestino = 10;
		var movmiento = {
			IdSucursal: 1,
			NumeroInternado: vm.internado.numero_internado,
			IdTipoDestino: tipoDestino,
			Observaciones: vm.observaciones,
			Detalles: <Array<any>>[]
		};
		for (var i = 0; i < vm.materialesCargados.length; i++) {
			if (vm.materialesCargados[i].Cantidad > 0) {
				var detalle = {
					IdProducto: vm.materialesCargados[i].Material.IdProducto,
					Cantidad: vm.materialesCargados[i].Cantidad
				}
				movmiento.Detalles.push(detalle);
			}
		}
		if (movmiento.Detalles.length > 0) {
			vm.$log.debug('a guardar', movmiento);
			vm.MovimientoStockDataService.newMovimientoQuirofano(movmiento)
				.then(function () {
					vm.AlertaService.NewSuccess("Productos Cargados");
				})
		}
		else {
			vm.AlertaService.NewWarning("No se cargo ningún producto!")
		}
	}

	public limpiar() {
		var vm = this;
		vm.materialesCargados = [];
		vm.hayCargados();
	}

	public $onChanges(aa) {
		var vm = this;
		if (vm.activate.NAME == "QUIROFANO")
			vm.initData();
	}


	/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */

	private initData() {
		var vm = this;
		vm.$log.debug('GetGruposFarmacia');
		var grupos = vm.GrupoFarmaciaDataService.getGruposFarmacia();
		var internados = vm.UbicacionDataService.getAllInternacionesBySucursal(vm.StockFarmaciaLogicService.sucursal.Id);
		var materiales = vm.MaterialDataService.getMaterialesDto();
		vm.$q.all([grupos, internados, materiales]).then(initDataOk);
		// vm.GrupoFarmaciaDataService.getGruposFarmacia()
		//     .then(initDataOk);

		function initDataOk(result) {
			vm.grupos = result[0];
			vm.internados = result[1];
			vm.materiales = result[2];
		}
	}

	$onInit() {
		this.$log = this.$log.getInstance('StockTabQuirofanoController');
		this.$log.debug('ON.-');
		this.$log.debug('$onInit');
	}
}