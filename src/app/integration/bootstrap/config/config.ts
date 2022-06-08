/**
 * @author:			Ezequiel Mansilla
 * @description:	Configuración  para ui.bootstrap
 * @type:			Config
 **/
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		/* Configuración de DataPicker */
		ngModule.config(configDataPicker);
		/* Configuración de TimePicker */
		ngModule.config(configTimePicker);
		/* Configuración de Pagination  */
		ngModule.config(configPagination);
		/* Configuración de Modal  */
		ngModule.config(configModal);

		configDataPicker.$inject = ['uibDatepickerConfig', 'uibDatepickerPopupConfig'];
		function configDataPicker (uibDatepickerConfig, uibDatepickerPopupConfig) {
			/*
				@default: 0
				Starting day of the week from 0-6 (0=Sunday, ..., 6=Saturday).
			 */
			uibDatepickerConfig.startingDay = 1;

			/*
				@default: true
				Whether to display week numbers.
			 */
			uibDatepickerConfig.showWeeks = false;

			/*
				@default: 0
				Format of year in year range.
			 */
			uibDatepickerConfig.formatYear = 'yy';

			/*
				@default: 'Done'
				The text to display for the close button.
			 */
			uibDatepickerPopupConfig.closeText = 'Cerrar';

			/*
				@default: 'Clear'
				The text to display for the clear button.
			 */
			uibDatepickerPopupConfig.clearText = 'Borrar';

			/*
				@default: 'Today'
				The text to display for the current day button.
			 */
			uibDatepickerPopupConfig.currentText = 'Hoy';

			/*
				@default: 'yyyy-MM-dd'
				The format for displayed dates.
			 */
			uibDatepickerPopupConfig.datepickerPopup = 'dd/MM/yyyy';
		}

		configTimePicker.$inject = ['uibTimepickerConfig'];
		function configTimePicker (uibTimepickerConfig) {
			/* 
				@default: 1
				Number of hours to increase or decrease when using a button.
			*/
			uibTimepickerConfig.hourStep = 1;

			/* 
				@default: 1
				Number of minutes to increase or decrease when using a button.
			*/
			uibTimepickerConfig.minuteStep = 1;

			/*
				@default: true
				Whether to display 12H or 24H mode.
			*/
			uibTimepickerConfig.showMeridian = false;

			/*
				@default: true
				Whether user can scroll inside the hours & minutes input to increase or decrease it's values.
			*/
			// uibTimepickerConfig.mousewheel = true;

			/*
				@default: true
				Whether user can use up/down arrowkeys inside the hours & minutes input to increase or decrease it's values.
			*/
			// uibTimepickerConfig.arrowkeys = true

			/*
				@default: true
				Shows spinner arrows above and below the inputs
			*/
			uibTimepickerConfig.showSpinners = false;
		}

		configPagination.$inject = ['uibPaginationConfig'];
		function configPagination (uibPaginationConfig) {
			/* 
				@default: 10
				Total number of items in all pages.
			*/
			// uibPaginationConfig.itemsPerPage = 10;

			/* 
				@default: 'Previous'
				Text for Previous  button.
			*/
			// uibPaginationConfig.previousText = '&rsaquo;';

			/* 
				@default: 'Next'
				Text for Next button.
			*/
			// uibPaginationConfig.nextText = '&rsaquo;';

			/* 
				@default: 'First'
				Text for First button.
			*/
			// uibPaginationConfig.firstText = '&rsaquo;';

			/* 
				@default: 'Last'
				Text for Last button.
			*/
			// uibPaginationConfig.lastText = '&rsaquo;';

			/*
				@default: true
				Whether to display Previous / Next buttons.
			*/
			uibPaginationConfig.directionLinks = true;

			/*
				@default: false
				Whether to display First / Last buttons.
			*/
			uibPaginationConfig.boundaryLinks = true;

			/*
				@default: null
				Limit number for pagination size.
			*/
			uibPaginationConfig.maxSize = 9;
		}

		configModal.$inject = ['$uibModalProvider'];
		function configModal ($uibModalProvider) {
			/* 
				@default: true
				Indicates whether the dialog should be closable by hitting the ESC key.
			*/
			$uibModalProvider.options.keyboard = false;

			/* 
				@default: true
				Controls presence of a backdrop.
				Allowed values: 
					true (default),
					false (no backdrop),
					'static' (disables modal closing by click on the backdrop).
			*/
			// $uibModalProvider.options.backdrop = 'static';

			/* 
				@default: true
				Set to false to disable animations on new modal/backdrop.
				Does not toggle animations for modals/backdrops that are already displayed.
			*/
			$uibModalProvider.options.animation = true;
		}
	};
	return module;

})();