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

var RequestManager = require('./RequestManager');
var EyeosAuth = require('eyeos-auth');
var settings = require("./settings");
var log2out = require("log2out");

var CredentialsManager = function (eyeosAuth, requestManager, logger) {
	this.card = null;
	this.signature = null;
	this.eyeosAuth = eyeosAuth || new EyeosAuth();
	this.requestManager = requestManager || new RequestManager();
	this.logger = logger || log2out.getLogger("CredentialsManager");
};

function basicRequestWithCardAndSignature () {
	return this.requestManager.basicRequestWithUrlAndContentType()
		.header('card', this.getCard())
		.header('signature', this.getSignature());
}

CredentialsManager.prototype._fakeLogin = function (done, username, data) {
	var fakeAuth = this.eyeosAuth.getFakeAuth(username || 'eyeos', data);
	this.card = fakeAuth.card;
	this.signature = fakeAuth.signature;
	done();
};

CredentialsManager.prototype._fakeLogout = function (done) {
	this.card = null;
	this.signature = null;
	done();
};

CredentialsManager.prototype._realLogin = function (done, username, password, baseURL, domain) {
	var self = this;
	var basicRequest;
	if (baseURL) {
		basicRequest = this.requestManager.basicRequest(baseURL);
	} else {
		basicRequest = this.requestManager.basicRequest();
	}
	basicRequest.parser(function(body, fn) {
		self.logger.debug("LOGIN RESPONSE: ", body);
		var res = JSON.parse(body);
		self.card = res.card;
		self.signature = res.signature;
		fn(null, body);
	})
	.post('/login/v1/methods/login/')
	.send({
		"type": "Basic",
		"username": username || settings.username,
		"password": password || settings.password,
		"domain": domain || 'open365.io'
	})
	.end(done);
};

CredentialsManager.prototype._realLogout = function (done) {
	basicRequestWithCardAndSignature.call(this)
		.post('/relay/presence/v1/routingKey/logout/userEvent/logout')
		.send({
			timestamp: new Date().getTime()
		})
		.end(done);
};

CredentialsManager.prototype.login = function (done, username, data, baseURL, domain) {
	if (typeof(data) === 'string') {
		this._realLogin(done, username, data, baseURL, domain);
	} else {
		this._fakeLogin(done, username, data);
	}
};

CredentialsManager.prototype.logout = function (done, isReal) {
	if (isReal) {
		this._realLogout(done);
	} else {
		this._fakeLogout(done);
	}
};

CredentialsManager.prototype.getCard = function () {
	if (!this.card) {
		throw Error("There is no card. Did you login?");
	}
	return JSON.stringify(this.card);
};

CredentialsManager.prototype.getSignature = function () {
	if (!this.signature) {
		throw Error("There is no signature. Did you login?");
	}
	return this.signature;
};

module.exports = CredentialsManager;
