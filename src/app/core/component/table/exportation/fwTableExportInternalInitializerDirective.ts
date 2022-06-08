/**
 * @author:			Ezequiel Mansilla
 * @description:	Initializador de eventos de exportacion interna
 * @type:			Directive
 **/
import * as angular from 'angular';

export default (function () {
	'use strict';

	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.directive('fwTableExportInternalInitializer', fwTableExportInternalInitializer);

		fwTableExportInternalInitializer.$inject = ['$log', '$q', '$timeout', '$document', 'CSV'];
		function fwTableExportInternalInitializer ($log, $q, $timeout, $document, CSV) {
			return {
				restrict : 'E',
				link: link
			};

			function link (scope, element, attrs) {
				// $log.debug('fwTableExportInternalInitializer linked');

				scope.$on('fw-table-export-iternal-event', function (event, data) {
					// $log.debug('fwTableExportInternalInitializer $on ',data);
					if (data.isCsv()) {
						buildCSV(data.isExportAll()).then(function (csv) {
							doClick(csv);
						});
					}
				});

				function doClick(pCsv) {
					var charset = scope.charset || "utf-8";
					var blob = new Blob([scope.csv], {
						type: "text/csv;charset="+ charset + ";"
					});

					if (window.navigator.msSaveOrOpenBlob) {
						navigator.msSaveBlob(blob, getFilename());
					} else {

						var downloadContainer = angular.element('<div data-tap-disabled="true"><a></a></div>');
						var downloadLink = angular.element(downloadContainer.children()[0]);
						downloadLink.attr('href', window.URL.createObjectURL(blob));
						downloadLink.attr('download', getFilename());
						downloadLink.attr('target', '_blank');

						$document.find('body').append(downloadContainer);
						$timeout(function () {
							downloadLink[0].click();
							downloadLink.remove();
						}, null);
					}
				}

				function buildCSV(isAll) {
					var deferred = $q.defer();
					var dataItems: any;
					var onlyVisibleColumns = true;

					if (isAll) {
						dataItems = scope.table.getData(onlyVisibleColumns);
						if (scope.table.pagination.isExterna()) $log.warn('Se intenta exportar todo con paginación externa.');
					} else {
						dataItems = scope.table.getRows(onlyVisibleColumns);
					}

					element.addClass(attrs.ngCsvLoadingClass || 'ng-csv-loading');
					CSV.stringify(dataItems, getBuildCsvOptions()).then(function (csv) {
						scope.csv = csv;
						element.removeClass(attrs.ngCsvLoadingClass || 'ng-csv-loading');
						deferred.resolve(csv);
					});
					// scope.$apply(); // Old angular support

					return deferred.promise;
				}

				function getFilename () {
					return scope.filename || 'download.csv';
				}

				function getBuildCsvOptions() {
					var onlyVisible = true;

					var options : any = {
						txtDelim: scope.txtDelim ? scope.txtDelim : '"',
						decimalSep: scope.decimalSep ? scope.decimalSep : '.',
						quoteStrings: scope.quoteStrings,
						addByteOrderMarker: scope.addByteOrderMarker
					};

					var cols = scope.table.getColsLabel(onlyVisible);

					if (angular.isDefined(cols)) options.header = cols;
					//if (angular.isDefined(attrs.csvColumnOrder)) options.columnOrder = scope.$eval(scope.columnOrder);
					if (angular.isDefined(attrs.csvLabel)) options.label = scope.$eval(scope.label);

					options.fieldSep = scope.fieldSep ? scope.fieldSep : ",";

					// Replaces any badly formatted special character string with correct special character
					options.fieldSep = CSV.isSpecialChar(options.fieldSep) ? CSV.getSpecialChar(options.fieldSep) : options.fieldSep;

					return options;
				}

			}
		}
	};

	return module;
})();