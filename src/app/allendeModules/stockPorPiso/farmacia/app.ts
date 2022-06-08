import * as angular from 'angular';

// Services
import StockFarmaciaLogicService from "./services/StockFarmaciaLogicService";

// Controllers
import MovimientoPrintController from "./controllers/MovimientoPrintController";
import InternadoStockPrintController from "./controllers/InternadoStockPrintController";
import ViewDetalleController from "./controllers/ViewDetalleController";
import ViewDetalleReposicionController from "./controllers/ViewDetalleReposicionController";
import StockPrintController from "./controllers/StockPrintController";
import DosificacionStockPrintController from "./controllers/DosificacionStockPrintController";
import ViewDetalleDosificacionController from "./controllers/ViewDetalleDosificacionController";
import ViewDetalleInfusionController from "./controllers/ViewDetalleInfusionController";
import NewEntregaController from "./controllers/NewEntregaController";
import NewEntregaGuardiaController from "./controllers/NewEntregaGuardiaController";
import ViewFacturadoController from "./controllers/ViewFacturadoController";
import EntregarDescartableController from "./controllers/EntregarDescartableController";
import FarmaciaController from "./controllers/FarmaciaController";
import DosificacionStockInternadoPrintCotroller from "./controllers/DosificacionStockInternadoPrintCotroller";
import ViewGruposController from "./controllers/ViewGruposController";
import CambiarProductoController from "./controllers/CambiarProductoController";

// Directives
import saUbicacionPiso from "./directives/saUbicacionPiso";
import saStockTabReposicion from "./directives/stockTabReposicion/saStockTabReposicion";
import saStockTabListado from "./directives/saStockTabListado";
import saStockTabAjuste from "./directives/saStockTabAjuste";
import saStockTabValidacion from "./directives/saStockTabValidacion";
import saStockTabInforme from "./directives/saStockTabInforme";
import saStockTabFacturacion from "./directives/saStockTabFacturacion";

// Components
import { StockTabQuirofano, StockTabRepoQuirofano } from './components';

// Modules
import { StockFarmaciaConfigModule } from './config';
import { StockFarmaciaModalService } from './services';

const modules = [
	StockFarmaciaConfigModule
]

export const StockFarmaciaModule = angular.module('stockPorPiso.farmacia', modules.map(m => m.name));

// Services
StockFarmaciaLogicService.init(StockFarmaciaModule);
StockFarmaciaModalService.init(StockFarmaciaModule);

// Controllers
MovimientoPrintController.init(StockFarmaciaModule);
InternadoStockPrintController.init(StockFarmaciaModule);
ViewDetalleController.init(StockFarmaciaModule);
ViewDetalleReposicionController.init(StockFarmaciaModule);
StockPrintController.init(StockFarmaciaModule);
DosificacionStockPrintController.init(StockFarmaciaModule);
ViewDetalleDosificacionController.init(StockFarmaciaModule);
ViewDetalleInfusionController.init(StockFarmaciaModule);
NewEntregaController.init(StockFarmaciaModule);
NewEntregaGuardiaController.init(StockFarmaciaModule);
ViewFacturadoController.init(StockFarmaciaModule);
EntregarDescartableController.init(StockFarmaciaModule);
DosificacionStockInternadoPrintCotroller.init(StockFarmaciaModule);
ViewGruposController.init(StockFarmaciaModule);
CambiarProductoController.init(StockFarmaciaModule);
FarmaciaController.init(StockFarmaciaModule);

// Directives
saUbicacionPiso.init(StockFarmaciaModule);
saStockTabReposicion.init(StockFarmaciaModule);
saStockTabListado.init(StockFarmaciaModule);
saStockTabAjuste.init(StockFarmaciaModule);
saStockTabValidacion.init(StockFarmaciaModule);
saStockTabInforme.init(StockFarmaciaModule);
saStockTabFacturacion.init(StockFarmaciaModule);

// Components
StockTabQuirofano.init(StockFarmaciaModule);
StockTabRepoQuirofano.init(StockFarmaciaModule);


StockFarmaciaModule.run(runMethod);

runMethod.$inject = ['Logger'];
function runMethod ($log) {
	$log = $log.getInstance('StockPorPiso.Farmacia');
	$log.debug('ON.-');
}