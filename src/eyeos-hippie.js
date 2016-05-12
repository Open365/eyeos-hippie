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

var hippie = require('hippie');
var URL = require('url');
var HarExtractor = require('./lib/harExtractor');
var CredentialsManager = require('./lib/CredentialsManager');
var RequestManager = require('./lib/RequestManager');
var EyerunHippie = require('./lib/eyerunHippie');

hippie.assert.showDiff = true;

function EyeosHippie (harExtractor, credentialsManager, requestManager) {
	this.harExtractor = harExtractor || new HarExtractor();
	this.credentialsManager = credentialsManager || new CredentialsManager();
	this.requestManager = requestManager || new RequestManager();
}

EyeosHippie.prototype.login = function (done, username, data, baseURL, domain) {
	this.credentialsManager.login(done, username, data, baseURL, domain);
};

EyeosHippie.prototype.logout = function (done, isReal) {
	this.credentialsManager.logout(done, isReal);
};

EyeosHippie.prototype.basicRequest = function (baseUrl) {
	return this.requestManager.basicRequest(baseUrl);
};

EyeosHippie.prototype.basicRequestWithCardAndSignature = function (data) {
	return this.requestManager.basicRequestWithUrlAndContentType(data)
		.header('card', this.credentialsManager.getCard())
		.header('signature', this.credentialsManager.getSignature());
};

EyeosHippie.prototype.getCard = function () {
	return this.credentialsManager.getCard();
};

EyeosHippie.prototype.getSignature = function () {
	return this.credentialsManager.getSignature();
};

EyeosHippie.prototype.setRequestFromHar = function(harPath, authenticatedRequest, baseUrl) {
	var request = this.harExtractor.getRequest(harPath);
	var method = request.method === 'DELETE' ? 'del' : request.method.toLowerCase();
	var parsedUrl = URL.parse(request.url);

	baseUrl = baseUrl || (parsedUrl.protocol + '//' + parsedUrl.host);

	var path = parsedUrl.path;
	var result;
	if (authenticatedRequest) {
		result = this.basicRequestWithCardAndSignature(baseUrl)[method](path);
	} else {
		result = this.basicRequest(baseUrl)[method](path);
	}

	if (request.bodySize > 0 && method === 'post') {
		var data = {};
		try {
			data = JSON.parse(request.postData.text);
		} catch (e) {
			console.log(e);
		}
		result.send(data);
	}

	request.headers.forEach(function(header) {
		if (header.name !== 'card' && header.name !== 'signature' && header.name !== 'Content-Length')
			result.header(header.name, header.value);
	});

	return result;
};

EyeosHippie.prototype.getResponseFromHar = function (harPath) {
	return this.harExtractor.getResponse(harPath);
};

EyeosHippie.prototype.getEyerunHippie = function() {
	return new EyerunHippie(this);
};

module.exports = EyeosHippie;
