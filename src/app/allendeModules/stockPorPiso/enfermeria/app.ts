import * as angular from 'angular';

//Services
import StockEnfermeriaLogicService from "./services/StockEnfermeriaLogicService";

//Controllers
import AsignarEnfermeraController from "./controllers/AsignarEnfermeraController";
import AutorizarScrapController from "./controllers/AutorizarScrapController";
import NewScrapController from "./controllers/NewScrapController";
import NewScrapEnfermeraController from "./controllers/NewScrapEnfermeraController";
import StockPrintController from "./controllers/StockPrintController";
import UtilizadosPrintController from "./controllers/UtilizadosPrintController";
import NewAsignacionController from "./controllers/NewAsignacionController";
import ViewDetalleEnfermeriaController from "./controllers/ViewDetalleEnfermeriaController";
import EnfermeriaController from "./controllers/EnfermeriaController";

import saStockTabAsignacion from "./directives/stockTabAsignacion/saStockTabAsignacion";
import saStockTabListadoEnfermeria from "./directives/stockTabListadoEnfermeria/saStockTabListadoEnfermeria";
import { StockEnfermeriaConfigModule } from './config';
import { StockEnfermeriaModalService } from './services';

const modules = [StockEnfermeriaConfigModule];

export const StockEnfermeriaModule = angular.module('stockPorPiso.enfermeria', modules.map(m => m.name));

StockEnfermeriaLogicService.init(StockEnfermeriaModule);
StockEnfermeriaModalService.init(StockEnfermeriaModule);

AsignarEnfermeraController.init(StockEnfermeriaModule);
AutorizarScrapController.init(StockEnfermeriaModule);
NewScrapController.init(StockEnfermeriaModule);
NewScrapEnfermeraController.init(StockEnfermeriaModule);
StockPrintController.init(StockEnfermeriaModule);
UtilizadosPrintController.init(StockEnfermeriaModule);
NewAsignacionController.init(StockEnfermeriaModule);
ViewDetalleEnfermeriaController.init(StockEnfermeriaModule);

EnfermeriaController.init(StockEnfermeriaModule);

saStockTabAsignacion.init(StockEnfermeriaModule);
saStockTabListadoEnfermeria.init(StockEnfermeriaModule);

StockEnfermeriaModule.run(runMethod);

runMethod.$inject = ['Logger'];
function runMethod($log) {
	$log = $log.getInstance('StockPorPiso.Enfermeria');
	$log.debug('ON.-');
}