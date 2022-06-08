/**
 * Created by emansilla on 15/05/2015.
 */
'use strict';
if(window.__karma__) {
	var allTestFiles = [];
	var TEST_REGEXP = /(spec|test)\.js$/i;

	Object.keys(window.__karma__.files).forEach(function(file) {
		if (TEST_REGEXP.test(file)) {
			// Normalize paths to RequireJS module names.
			allTestFiles.push(file);
		}
	});
 }

 require.config({

 	// Definimos la base.
 	// baseUrl: '../',
 	// urlArgs: "bust=" + (new Date()).getTime(),

	// Definimos los alias.
	paths: {
		// app: "app/app",
		app : "src/dist/app/app",
		angular : "../node_modules/angular/angular.min",
		bootstrap : "../node_modules/bootstrap/dist/js/bootstrap.min",
		// canvas : "../node_modules/html2canvas/build/html2canvas",
		angularAnimate : "../node_modules/angular-animate/angular-animate",
		// angular-cooangularContextMenu : "../node_modules/angular-bootstrap-contextmenu/contextMenu", 04/10/2017
		// angularCookies : "../node_modules/angular-cookies/angular-cookies.min", 04/10/2017
		angularCsv : "../node_modules/ng-csv/build/ng-csv",
		angularGridster : "../node_modules/angular-gridster/dist/angular-gridster.min",
		angularLocale : "../node_modules/angular-i18n/angular-locale_es-ar",
		angularLocalStorage : "../node_modules/angular-local-storage/dist/angular-local-storage",
		// angularMd5 : "../node_modules/angular-md5/angular-md5.min", 04/10/2017
		angularMessages : "../node_modules/angular-messages/angular-messages.min",
		angularMocks : "../node_modules/angular-mocks/angular-mocks",
		angularMoment : "../node_modules/angular-moment/angular-moment.min",
		angularResource : "../node_modules/angular-resource/angular-resource.min",
		// angularRoute : "../node_modules/angular-route/angular-route.min", 04/10/2017
		angularSanitize : "../node_modules/angular-sanitize/angular-sanitize.min",
		// angularSnap : "../node_modules/angular-snap/angular-snap", 04/10/2017
		angularToaster : "../node_modules/angularjs-toaster/toaster.min",
		angularUiGrid : "../node_modules/angular-ui-grid/ui-grid",
		angularUiRouter : "../node_modules/angular-ui-router/release/angular-ui-router.min",
		angularUiSwitch : "../node_modules/angular-ui-switch/angular-ui-switch.min",

		jquery : "../node_modules/jquery/dist/jquery.min",
		// jqueryInputMask : "../node_modules/inputmask/dist/jquery.inputmask.bundle", 04/10/2017
		
		// Para que funcione clarika
		// modernizr : "dist/js/vendor/modernizr-2.8.3.min",
		// modernizrCustom : "dist/js/notificacion/modernizr.custom",
		moment : "../node_modules/moment/min/moment-with-locales",
		pdfMake : "../node_modules/pdfmake/build/pdfmake",
		// snap : "../node_modules/snapjs/snap", 04/10/2017
		uiBootstrap : "../node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls",
		angularBootstrapDateTimePicker : "../node_modules/angular-bootstrap-datetimepicker/src/js/datetimepicker",
		angularBootstrapDateTimePickerTemplate : "../node_modules/angular-bootstrap-datetimepicker/src/js/datetimepicker.templates",
		vfsFonts : "../node_modules/pdfmake/build/vfs_fonts",
		// ckEditor : "../node_modules/ckeditor/ckeditor", 04/10/2017
		// angualrCkEditor : "../node_modules/angular-ckeditor/angular-ckeditor", 04/10/2017
		highcharts : "../node_modules/highcharts/highcharts.src",
		highchartsDark : "../node_modules/highcharts/themes/dark-unica",
		highchartsExporting : "../node_modules/highcharts/modules/exporting",
		fullCalendar: "../node_modules/fullcalendar/dist/fullcalendar.min"


	},

	// Gestio de módulos y dependencias.
	shim: {
		// Angular depende de JQuery.
		"angular": {
			deps: ["jquery"],
			// Al todos requerir de angular, lo exportamos.
			exports: "angular"
		},
		"angularAnimate": {
			deps: ["angular"]
		},
		"angularContextMenu": {
			deps: ["angular"]
		},
		"angularCookies": {
			deps: ["angular"]
		},
		"angularSanitize" : {
			deps: ["angular"]
		},
		"angularCsv" : {
			deps: ["angular", "angularSanitize"]
		},
		"angularGridster" : {
			deps: ["angular"]	
		},
		"angularLocale": {
			deps: ["angular"]
		},
		"angularLocalStorage" : {
			deps: ["angular"]
		},
		"angularMd5": {
			deps: ["angular"]
		},
		"angularMocks": {
			deps: ["angular"],
			exports:"angular.mock"
		},
		"angularMoment": {
			deps: ["angular", "moment"],
			exports:"angularMoment"
		},
		"angularMessages" : {
			deps: ["angular"],
			exports:"angularMessages"
		},
		"angularResource": {
			deps: ["angular"]
		},
		"angularRoute": {
			deps: ["angular"]
		},
		"angularSnap": {
			deps: ["angular", "snap"]
		},
		"angularToaster" : {
			deps: ["angular", "angularAnimate"]
		},
		"angularUiGrid" : {
			deps: ["angular"]
		},
		"angularUiRouter" : {
			deps: ["angular"]	
		},
		"angularUiSwitch" : {
			deps: ["angular"]
		},
		"bootstrap": {
			deps: ["angular"]
		},
		"angualrCkEditor" : {
			deps: ["ckEditor", "angular"]
		},
		"uiBootstrap": {
			deps: ["angular"]
		},
		"angularBootstrapDateTimePicker":{
			deps: ["angular", "moment"],
			exports: ["angularBootstrapDateTimePicker"]
		},
		"angularBootstrapDateTimePickerTemplate":{
			deps: ["angularBootstrapDateTimePicker"]
		}, 
		"vfsFonts" : {
			deps : ["pdfMake"]
		},
		"highchartsDark" : {
			deps : ["highcharts"]
		},
		"highchartsExporting" : {
			deps : ["highcharts"]
		}
	},
	// dynamically load all test files
	deps: window.__karma__ ? allTestFiles : [],
	callback: window.__karma__ ? window.__karma__.start : null,
	baseUrl: window.__karma__ ? '/base/' : './',

});

// Lanzamos la app si no es para test
if(!window.__karma__) {
	require(["app"]);
}