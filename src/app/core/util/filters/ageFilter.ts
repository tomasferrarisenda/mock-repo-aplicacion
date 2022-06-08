/**
 * @author 			emansilla
 * @description 	description
 */
export default (function () {
	'use strict';

	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		// UTILIDADES: [FILTER] Transforma la fecha de nacimiento en edad con años, meses y días.
		ngModule.filter('ageFilter', ageFilter);

		ageFilter.$inject = ['moment', '$log'];
		function ageFilter (moment, $log) {
			
			return function (birthdate) {
				if (!birthdate) return;
				
				const age = getAge(birthdate);
				var ageText = '';

				if (age.years) {
					ageText = age.years + ' años ';
					if (age.months) {
						ageText += age.months + ' meses ';
						if (age.days) {
							ageText += age.days + ' días.';
						}
					}
					else if (age.days) {
						ageText += age.days + ' días.';
					}
				}
				else if (age.months) {
					ageText = age.months + ' meses ';
					if (age.days) {
						ageText += age.days + ' días.';
					}
				}
				else if (age.days) {
					ageText = age.days + ' días.';
				}

				// var _ageText = _age.years + ' años ' + _age.months + ' meses ' + _age.days + ' días.';

				return ageText;

				// $log.debug('Fecha Nac. input ', birthdate);
				// var _birthdate = new Date(birthdate),
				// 	_now = new Date(),
				// 	_age;

				// _age = getYearDiff(_birthdate, _now);
				// $log.debug('Fecha Nac. ', _birthdate);
				// if (_age == 0) {
				// 	_age = moment(birthdate).startOf('month').fromNow(true);
				// }
				// return _age;
			};
		}

		function getAge(birthDate, ageAtDate?) {
			const daysInMonth = 30.436875; // Days in a month on average.
			const dob = new Date(birthDate);
			var aad;
			if (!ageAtDate) aad = new Date();
			else aad = new Date(ageAtDate);
			const yearAad = aad.getFullYear();
			const yearDob = dob.getFullYear();
			var years = yearAad - yearDob; // Get age in years.
			dob.setFullYear(yearAad); // Set birthday for this year.
			const aadMillis = aad.getTime();
			var dobMillis = dob.getTime();
			if (aadMillis < dobMillis) {
				--years;
				dob.setFullYear(yearAad - 1); // Set to previous year's birthday
				dobMillis = dob.getTime();
			}
			var days = (aadMillis - dobMillis) / 86400000;
			const monthsDec = days / daysInMonth; // Months with remainder.
			const months = Math.floor(monthsDec); // Remove fraction from month.
			days = Math.floor(daysInMonth * (monthsDec - months));
			return {years: years, months: months, days: days};
		}

		function getYearDiff(d0, d1) {

			d1 = d1 || new Date();

			const m = d0.getMonth();
			var years = d1.getFullYear() - d0.getFullYear();

			d0.setFullYear(d0.getFullYear() + years);

			if (d0.getMonth() !== m) d0.setDate(0);

			return d0 > d1 ? --years : years;
		}
	};

	return module;

})();