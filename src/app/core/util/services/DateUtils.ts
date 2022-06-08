import * as angular from 'angular';
/**
 * @author:			Ezequiel Mansilla
 * @description:	Extensión de metodos para Date
 * @type:			Service
 **/
class DateUtils implements IDateUtils {
	
	constructor(private $log: ILogger, private $filter: angular.IFilterService) {
		$log = $log.getInstance('DateUtils');
		$log.debug('ON.-');
	}

	public parseToFe (pStringDate: string): any {
		if (!pStringDate) return;
		if (pStringDate === '0001-01-01T00:00:00') return;
		// input like 	'2016-05-20T10:54:00'
		// 				"2017-02-17T00:00:00"
		var year, month, days, hours, minutes, seconds, miliseconds;

		year = this.$filter('limitTo')(pStringDate, 4);
		month = this.$filter('limitTo')(pStringDate, 2, 5);
		days = this.$filter('limitTo')(pStringDate, 2, 8);
		hours = this.$filter('limitTo')(pStringDate, 2, 11);
		minutes = this.$filter('limitTo')(pStringDate, 2, 14);
		seconds = this.$filter('limitTo')(pStringDate, 2, 17);
		miliseconds = 0;

		return new Date(year, month - 1 , days, hours, minutes, seconds, miliseconds);
	}

	public parseToBe (pDate: Date): any {
		if (!pDate) return;
		
		return this.$filter('date')(pDate, 'MM/dd/yyyy HH:mm');
	}

	public parseToBeParams (pDate: Date) {
		if (!pDate) return;
		
		return this.$filter('date')(pDate, 'MM-dd-yyyy');
	}

	public addHours (pDate: Date, pHoras: number) {
		const date = pDate;
		date.setHours(date.getHours() + pHoras);
		return date;
	}

	public addMinutes (pDate: Date, pMinutos: number) {
		const date = pDate;
		date.setMinutes(date.getMinutes() + pMinutos);
		return date;
	}

	public addHoursMinutes (pDate: Date, hoursMinutes: string) {
		var date = pDate;
		var hours = parseInt(hoursMinutes.substr(0, 2));
		var minutes = parseInt(hoursMinutes.substr(3, 4));
		date.setHours(date.getHours() + hours);
		date.setMinutes(date.getMinutes() + minutes);
		return date;
	}

	public addDays (pDate: Date, pDias: number) {
		const date = pDate;
		date.setDate(date.getDate() + pDias);
		return date;
	}

	/**
	 * Quita dias a la fecha
	 */
	public removeDays(pDate: Date, pDias: number) {
		const date = pDate;
		date.setDate(date.getDate() - pDias);
		return date;
	}

	public removeYears (pDate: Date, pYears: number) {
		const date = pDate;
		date.setFullYear(date.getFullYear() - pYears);
		return date;
	}

	public getYearsOld(pFechaNacimiento: Date, pFechaComparacion?: Date) {
		const fechaHoy = pFechaComparacion || new Date();
		// var array_fecha = pFechaNacimiento.split("-") ;
		// var anoNacimiento  = parseInt(array_fecha[2]);
		const anoNacimiento  = pFechaNacimiento.getFullYear();
		const anohoy = fechaHoy.getFullYear();
		var edad = anohoy - anoNacimiento;
		// obtenemos el mes y dia 
		const meshoy = fechaHoy.getMonth();
		const mesNacimiento = pFechaNacimiento.getMonth();
		const diahoy = fechaHoy.getDate();
		const diaNacimiento = pFechaNacimiento.getDate();

		if (meshoy < mesNacimiento) {
				edad--;
		}
		if ((meshoy === mesNacimiento) && (diahoy < diaNacimiento)) {
			edad--;
		}
		return edad;
	}

	public getDateFromMoment(momentDate: any){
		
		return new Date(momentDate.year(), momentDate.month() , momentDate.date());
	}

	static serviceFactory($log, $filter) {
		return new DateUtils($log, $filter);
	}
}
DateUtils.serviceFactory.$inject = ['Logger', '$filter'];
export default class {
	public static init(ngModule: angular.IModule) {
		ngModule.factory('DateUtils', DateUtils.serviceFactory);
	}
}