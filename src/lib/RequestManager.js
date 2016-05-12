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
var settings = require('./settings');

var opts = function(sett) {
	sett.rejectUnauthorized = false;
};

var RequestManager = function  (hip) {
	this.hippie = hip || hippie;
	this.timeoutValue = settings.timeoutValue || 2000;
};

RequestManager.prototype.basicRequest = function (baseUrl) {
	return this.hippie()
		.json()
		.opts(opts)
		.base(baseUrl || 'https://localhost')
		.timeout(this.timeoutValue);
};

RequestManager.prototype.basicRequestWithUrlAndContentType = function (data) {
	var baseUrl, contentType;
	if (data && typeof(data) === 'object') {
		baseUrl = data.baseUrl;
		contentType = data.contentType;
	}
	if (typeof(data) === 'string') {
		baseUrl = data;
	}
	return this.basicRequest(baseUrl)
		.header('Content-Type', contentType || 'application/x-www-form-urlencoded');
};

module.exports = RequestManager;
