/**
 * @author:			Ezequiel Mansilla
 * @description:	Configuración de http
 * @type:			Service
 **/
import * as angular from 'angular';

export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		/* Configuración de cabecera http.*/
		ngModule.config(configHttp);

		configHttp.$inject = ['$httpProvider'];
		function configHttp ($httpProvider) {

			//initialize get if not there
			if (!$httpProvider.defaults.headers.get) {
				$httpProvider.defaults.headers.get = {};
			}

			// Answer edited to include suggestions from comments
			// because previous version of code introduced browser-related errors

			//disable IE ajax request caching
			$httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
			// extra
			$httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
			$httpProvider.defaults.headers.get['Pragma'] = 'no-cache';

			// Use x-www-form-urlencoded Content-Type
			$httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
			$httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
			$httpProvider.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

			// Override $http service's default transformRequest
			$httpProvider.defaults.transformRequest = [function (data) {

				/**
				* The workhorse; converts an object to x-www-form-urlencoded serialization.
				* @param {Object} obj
				* @return {String}
				*/
				var param = function (obj) {
					var query = '';
					var name, value, fullSubName, subName, subValue, innerObj, i;

					for (name in obj) {
						value = obj[name];

						if (value instanceof Array) {
							for (i = 0; i < value.length; ++i) {
								subValue = value[i];
								fullSubName = name + '[' + i + ']';
								innerObj = {};
								innerObj[fullSubName] = subValue;
								query += param(innerObj) + '&';
							}
						}
						else if (value instanceof Object) {
							for (subName in value) {
								subValue = value[subName];
								fullSubName = name + '[' + subName + ']';
								innerObj = {};
								innerObj[fullSubName] = subValue;
								query += param(innerObj) + '&';
							}
						}
						else if (value !== undefined && value !== null) {
							query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
						}
					}

					return query.length ? query.substr(0, query.length - 1) : query;
				};

				return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
				}];
		}
	};

	return module;

})();