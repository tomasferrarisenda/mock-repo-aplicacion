declare interface IDateUtils {
	/**
	 * Convierte la fecha que llega desde Back para uso de Front
	 */
	parseToFe(stringDate: any) : Date;
	/**
	 * Convierte la fecha de Front para mandar al Back
	 */
	parseToBe(date: Date) : any;
	/**
	 * Convierte la fecha de Front para mandar al Back en forma de parametro URL
	 */
	parseToBeParams(date: Date) : any;
	/**
	 * Agrega horas a la fecha
	 */
	addHours(date: Date, hours: number) : any;
	/**
	 * Agrega minutos a la fecha
	 */
	addMinutes(date: Date, minutes: number) : any;
	/**
	 * Agrega horas a la fecha
	 * @param date Date
	 * @param hoursMinutes Con formato "HH:mm"
	 */
	addHoursMinutes: (date: Date, hoursMinutes: string) => Date;
	/**
	 * Agrega dias a la fecha
	 */
	addDays(date: Date, days: number) : any;

	/**
	 * Quita dias a la fecha
	 */
	removeDays(date: Date, days: number): any;

	/**
	 * Quita años a la fecha
	 */
	removeYears (pDate: Date, pYears: number): Date;
	
	/**
	 * Calcula años de diferencia entre dos fechas.
	 */
	getYearsOld(fechaDesde: Date, fechaHasta?: Date) : any;

	/**
	 * Devuelve un objeto date desde una fecha tipo moment
	 */
	getDateFromMoment(momentDate: any) : any;

}

declare interface Array<T> {
	sortBy(...props: any[]): Array<T>;
}