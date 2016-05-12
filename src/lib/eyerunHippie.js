/*
    Copyright (c) 2016 eyeOS

    This file is part of Open365.

    Open365 is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program. If not, see <http://www.gnu.org/licenses/>.
*/


function EyerunHippie (hippie4Eyeos) {
	this.hippie4Eyeos = hippie4Eyeos;
}

EyerunHippie.EYERUN_URL = 'http://localhost:7000';

EyerunHippie.prototype.login = function (card, signature, domain, transactionId) {
	var card = card || this.hippie4Eyeos.getCard();
	var signature = signature || this.hippie4Eyeos.getSignature();
	var domain = domain || '127.0.0.1';
	var transactionId = transactionId || 'myTransactionId';

	return this.hippie4Eyeos.basicRequestWithCardAndSignature(EyerunHippie.EYERUN_URL)
		.get('/setSession/' +
		encodeURIComponent(card) + '/' +
		encodeURIComponent(signature) + '/' +
		encodeURIComponent(domain) + '/' +
		encodeURIComponent(transactionId)
	)
		.parser(function(body, fn) {
			//We don't need to parse the image in response body, so we ignore it.
			fn(null, '');
		})
};

EyerunHippie.prototype.logout = function (done) {
	return this.hippie4Eyeos.basicRequestWithCardAndSignature(EyerunHippie.EYERUN_URL)
		.get('/logout/')
		.parser(function(body, fn) {
			//We don't need to parse the image in response body, so we ignore it.
			fn(null, '');
		})
		.end(function (){
			console.log('EyerunHippie: Called logout');
			done();
		})
};

module.exports = EyerunHippie;
