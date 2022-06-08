/**
 * @author 			emansilla
 * @description 	description
 */
import * as angular from 'angular';
import { HttpOptions } from '../models';
import { IAuthTicketDto } from 'core/security/models';

export interface IDtoService {
	Get(url: string, options?: HttpOptions) : angular.IPromise<any>;
	Post(url: string, data: any, options?: HttpOptions) : angular.IPromise<any>;
	Put(url: string, data: any, options?: HttpOptions) : angular.IPromise<any>;
	Delete(url: string, data: any, options?: HttpOptions) : angular.IPromise<any>;
	getCommon(pMethod: string, url: string, data: any, pParams: any, options?: HttpOptions): angular.IPromise<any>;
	getAccessToken(dataAccess:any, isRefresh?:boolean) : angular.IPromise<IAuthTicketDto>;
	DownloadFile(url: string, defaultName:string) : any;
	DownloadFileDto(url: string, defaultName:string, data: any) : any;
	UploadFile(url: string, file: any, data:any) : any;
}
class DtoService implements IDtoService{

	constructor(private $http, private $q, private APP_INFO, private ENV, private  HTTP_METHOD, private  HTTP_STATUS_CODE,
		private	HttpStatusCodeHandler, private FormEncode) {
			// $log = $log.getInstance('DtoService');
			// $log.debug('ON.-');
		}
	
		public Get (pUrl, pOptions: HttpOptions) {
			return this.GetDatos(this.HTTP_METHOD.GET, pUrl, undefined, pOptions);
		}

		public Put (pUrl, pData, pOptions: HttpOptions) {
			return this.GetDatos(this.HTTP_METHOD.PUT, pUrl, pData, pOptions);
		}

		public Post (pUrl, pData, options: HttpOptions) {
			var _data;
			if (options && options.isDictionary) {
				_data = JSON.stringify(pData);
			} else {
				_data = angular.toJson(pData);
			}
			return this.GetDatos(this.HTTP_METHOD.POST, pUrl, _data, options);
		}

		public Delete (pUrl, pData, pOptions: HttpOptions) {
			return this.GetDatos(this.HTTP_METHOD.DELETE, pUrl, pData, pOptions);
		}

		public GetDatos(pMethod, pUrl, pData, pOptions?: HttpOptions) {
			var def, _request;

			def = this.$q.defer();

			_request = {
				method : pMethod,
				url : this.ENV.BACKEND + pUrl,
				data : pData,
				dictionary: pOptions ? pOptions.isDictionary : false,
				cache: pOptions ? pOptions.isCachable : false
			};

			this.$http(_request).then(GetDatosOk, GetDatosError);

			function GetDatosOk (pResponse) {
				def.resolve(pResponse.data);
			}

			function GetDatosError (pResponse) {
				def.reject(pResponse);
			}

			return def.promise;
		}

		public DownloadFile(url, defaultFileName){
			  var self = this;
			var deferred = this.$q.defer();
			this.$http.get(this.ENV.BACKEND + url, { responseType: "blob" }).then(
				   function (data){
					//var blob = new Blob([data.data], {type : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'});
					var blob = new Blob([data.data], {type : data.type});
					// var objectUrl = (window.URL || window.webkitURL).createObjectURL(blob);
					var objectUrl = (window.URL).createObjectURL(blob);
					var link = angular.element('<a/>');
					link.attr({
						href : objectUrl,
						download : defaultFileName
					})[0].click();	

					}, function (data) {
					   var e = /* error */
						deferred.reject(e);
					});
				return deferred.promise;
		}

		public DownloadFileDto(url, defaultFileName, pData){
			var self = this;
		  var deferred = this.$q.defer();
 
			var _request = {
				method : this.HTTP_METHOD.POST,
				url : this.ENV.BACKEND + url,
				data : angular.toJson(pData),
				dictionary: false,
				cache: false,
				responseType: "blob"
			};

		  this.$http(_request).then(
				 function (data1){
				  //var blob = new Blob([data.data], {type : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'});
				  var blob = new Blob([data1.data], {type : data1.type});
				  // var objectUrl = (window.URL || window.webkitURL).createObjectURL(blob);
				  var objectUrl = (window.URL).createObjectURL(blob);
				  var link = angular.element('<a/>');
				  link.attr({
					  href : objectUrl,
					  download : defaultFileName
				  })[0].click();	

				  }, function (data1) {
					 var e = /* error */
					  deferred.reject(e);
				  });
			  return deferred.promise;
	  }

		public UploadFile (pUrl, pFile, pData) {
			var def = this.$q.defer();
			
			var _formData = new FormData();

			if(pData != null && !angular.isUndefined(pData))
			{
				// $log.debug('FilE: ', pFile);
				pData.FileName = pFile.name;
				// $log.debug('DatA: ', pData);                	
				_formData.append('data', angular.toJson(pData));
			}
			
			_formData.append('file', pFile);

			var _request = {
				contentTypeEspecifico : true,
				method: this.HTTP_METHOD.POST,
				url: this.ENV.BACKEND + pUrl,
				data: _formData,
				headers: { 
					'Content-Type': undefined
					// 'Authorization': 'Bearer ' + $rootScope.globals.currentUser.hashCode 
				},
				transformRequest: angular.identity
			};

			this.$http(_request).then(successCallback, errorCallback);

		   function successCallback (pResponse) {
				def.resolve(pResponse.data);
			}

			function errorCallback (pResponse) {
				def.reject(pResponse);
			}
			return def.promise;
		}

	public getCommon(pMethod, pUrl, pData, pParams, pOptions?) {
			var _def, _request;

			_def = this.$q.defer();

			_request = {
				method : pMethod,
				url : pUrl,
				headers : {},
				dictionary: pOptions ? pOptions.isDictionary : false
			};

			if (pData)
				_request.data = pData;
			else if (pParams) 
				_request.params = pParams;

			this.$http(_request).then(GetCommonOk, GetCommonError);

			function GetCommonOk (pResponse) {
				_def.resolve(pResponse.data);
			}

			function GetCommonError (pResponse) {
				_def.reject(pResponse);
			}

			return _def.promise;
		}

		public getAccessToken(pDataAccess, isRefresh): angular.IPromise<IAuthTicketDto> {
			let vm = this;
			var def, _request, _error;

			def = this.$q.defer();

			pDataAccess.grant_type = (isRefresh) ? this.ENV.REFRESH_GRANT_TYPE : this.ENV.TOKEN_GRANT_TYPE;

			var clientId = "AppSA";
			var clientSecret = "7SeGvoNkZze03n6L";
			var authorizationBasic = window.btoa(clientId + ':' + clientSecret);

			_request = {
				headersEspecificos : true,
				method: this.HTTP_METHOD.POST,
				url: this.ENV.TOKEN,
				data: this.FormEncode(pDataAccess),
				headers: {
					'From' : this.APP_INFO.name,
					'companyId': pDataAccess.companyId || 0,
					'Content-Type' : 'application/x-www-form-urlencoded',
					'Authorization': 'Basic ' + authorizationBasic 
				}
			};
			
			this.$http(_request).then(GetAccessTokenOk, GetAccessTokenError);

			function GetAccessTokenOk (pResponse) {
				def.resolve(pResponse.data);
			}

			function GetAccessTokenError (pResponse) {
				_error = {
					status : (pResponse.status == vm.HTTP_STATUS_CODE.BAD_REQUEST) ? vm.HTTP_STATUS_CODE.UNAUTHORIZED : pResponse.status,
					message : 'Error',
					error : 'ERROR'
				};
				
				if (pResponse.data) {
					_error.changePassword = (pResponse.data.error_uri == 'true' ) ? true : false;
					_error.message = pResponse.data.error_description;

				} else {
					_error.message = vm.HttpStatusCodeHandler.GetMessageByCode(_error.status);
				}
				def.reject(_error);
			}
			return def.promise;
		}

	static serviceFactory($http, $q, APP_INFO, ENV, HTTP_METHOD, HTTP_STATUS_CODE, HttpStatusCodeHandler, FormEncode) {
		return new DtoService($http, $q, APP_INFO, ENV, HTTP_METHOD, HTTP_STATUS_CODE, HttpStatusCodeHandler, FormEncode);
	}
}

DtoService.serviceFactory.$inject = ['$http', '$q', 'APP_INFO', 'ENV', 'HTTP_METHOD', 'HTTP_STATUS_CODE',
	'HttpStatusCodeHandler', 'FormEncode'];

export default class {
	static init (ngModule: angular.IModule){

		ngModule.factory('DtoService', DtoService.serviceFactory);
		ngModule.factory('DotService', DtoService.serviceFactory);
	}
}