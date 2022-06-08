import * as angular from 'angular';
import { IUbicacionDataService, IMovimientoStockDataService, IMaterialDataService } from '../../../common/services';
import { IStockFarmaciaModalService } from '../../services';

export class StockTabRepoQuirofanoController {
	static $inject: Array<string> = ['Logger',
		'UbicacionDataService', 'MovimientoStockDataService', 'MaterialDataService', 'StockFarmaciaModalService', 'StockFarmaciaLogicService',
		'AlertaService', '$q'
	];

	activate: any;
	pendientes: Array<any> = [];
	materiales: Array<any> = [];
	ubicacionQuirofano: any;
	producto: any;
	nuevaCordoba: boolean = false;
	cerro: boolean = false;
	cargarProducto: boolean = false;

	constructor(
		private $log: ILogger,
		private UbicacionDataService: IUbicacionDataService,
		private MovimientoStockDataService: IMovimientoStockDataService,
		private MaterialDataService: IMaterialDataService,
		private StockFarmaciaModalService: IStockFarmaciaModalService,
		private StockFarmaciaLogicService: any,
		private AlertaService: any,
		private $q: any) {
		this.$log = $log.getInstance('StockTabRepoQuirofanoController');
		this.$log.debug('ON.-');
	}

	public btnNewClick() {
		// this.crearPresupuesto();
	}

	public verGrupos() {
		this.StockFarmaciaModalService.viewGrupos();
	}

	public recargar() {
		var vm = this;
		vm.MovimientoStockDataService.obtenerPendientesPorUbicacionYTipo(34, 100)
			.then(function (pendientes) {
				vm.pendientes = pendientes;
				for (var i = 0; i < vm.pendientes.length; i++) {
					vm.pendientes[i].Stock = (vm.nuevaCordoba) ? vm.pendientes[i].StockNuevaCordoba : vm.pendientes[i].StockCerro;

				}
			})
	}

	public suma(material: any) {
		var vm = this;
		for (var i = 0; i < vm.pendientes.length; i++) {
			if (vm.pendientes[i].Id == material.Id) {
				vm.pendientes[i].Cantidad += 1;
				vm.pendientes[i].minimo = false;
			}
		}
	}

	public resta(material: any) {
		var vm = this;
		for (var i = 0; i < vm.pendientes.length; i++) {
			if (vm.pendientes[i].Id == material.Id) {
				vm.pendientes[i].Cantidad -= 1;
				if (vm.pendientes[i].Cantidad == 0) {
					vm.pendientes[i].minimo = true;
				}
			}
		}
	}

	public seleccionarProducto() {
		var vm = this;
		if (vm.producto.Id) {
			var pendiente = angular.copy(vm.producto);
			pendiente.Cantidad = 0;
			pendiente.minimo = true;

			var existe = false;
			for (var i = 0; i < vm.pendientes.length; i++) {
				if (vm.pendientes[i].Id == pendiente.Id)
					existe = true;
			}
			if (!existe)
				vm.pendientes.unshift(pendiente);
		}
		vm.producto = '';
		// vm.hayCargados();
		vm.nuevoProducto();
	}

    /**
     * nuevoProducto
     */
	public nuevoProducto() {
		this.cargarProducto = !this.cargarProducto;
	}

	public entregar() {
		var vm = this;
		var repo = {
			IdUbicacion: vm.ubicacionQuirofano.Id,
			Detalles: <Array<any>>[]
		};
		for (let i = 0; i < vm.pendientes.length; i++) {
			if (!vm.pendientes[i].Pendiente) {
				var detalle = {
					IdProducto: vm.pendientes[i].IdProducto,
					Cantidad: vm.pendientes[i].Cantidad
				};
				repo.Detalles.push(detalle);
			}
		}
		// TODO: Ver que estaba deshabilitado en StockFarmaciaDataService y aca se llamaba igual
		vm.MovimientoStockDataService.entregarRepoQuirofano(repo)
			.then(function () {
				vm.AlertaService.NewSuccess("Productos entregados con éxito");
			})
	}

	public $onChanges(aa) {
		var vm = this;
		if (vm.activate.NAME == "REPO_QUIROFANO")
			vm.initData();
	}


	/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */

	private initData() {
		var vm = this;
		var materiales = vm.MaterialDataService.getMaterialesDto();
		var ubicacionQuirofano = vm.UbicacionDataService.getQuirofanoBySucursal(vm.StockFarmaciaLogicService.sucursal.Id);
		vm.$q.all([materiales, ubicacionQuirofano]).then(initDataOk);
		vm.nuevaCordoba = vm.StockFarmaciaLogicService.sucursal.Id == 1;
		vm.cerro = vm.StockFarmaciaLogicService.sucursal.Id == 2;


		// vm.UbicacionDataService.getTotalNoRepuestoByUbicacionAndTipo(34,100)
		//     .then(initDataOk);

		function initDataOk(pResult) {
			vm.materiales = pResult[0];
			vm.ubicacionQuirofano = pResult[1];
			vm.MovimientoStockDataService.obtenerPendientesPorUbicacionYTipo(vm.ubicacionQuirofano.Id, 100)
				.then(function (pendientes) {
					vm.pendientes = pendientes;
					for (var i = 0; i < vm.pendientes.length; i++) {
						vm.pendientes[i].Stock = (vm.nuevaCordoba) ? vm.pendientes[i].StockNuevaCordoba : vm.pendientes[i].StockCerro;
					}
				})
			for (var i = 0; i < vm.materiales.length; i++) {
				vm.materiales[i].Stock = (vm.nuevaCordoba) ? vm.materiales[i].StockNuevaCordoba : vm.materiales[i].StockCerro;

			}
		}
	}

	$onInit() {
		this.$log.debug('$onInit');
	}
}