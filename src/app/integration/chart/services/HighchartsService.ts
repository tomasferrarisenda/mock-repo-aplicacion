/**
 * @author:			Ezequiel Mansilla
 * @description:	Servicio que expone Highcharts
 * @type:			Service
 **/
import Highcharts = require('highcharts');
// Load module after Highcharts is loaded
require('highcharts/modules/exporting')(Highcharts);
// require('highcharts/themes/dark-unica')(Highcharts);
// highcharts : "../node_modules/highcharts/highcharts.src",
// highchartsDark : "../node_modules/highcharts/themes/dark-unica",
// highchartsExporting : "../node_modules/highcharts/modules/exporting",
export default (function () {
	'use strict';
	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.value('Highcharts', Highcharts);
	};

	return module;
})();