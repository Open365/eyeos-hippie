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

/**
 *	Sample of the application component-test with eyeos-hippie
 */

var sinon = require('sinon');
var assert = require('chai').assert;
var Hippie4eyeos = require('../eyeos-hippie');

var hippie4Eyeos = new Hippie4eyeos();

setup(function (done) {
	hippie4Eyeos.login(done);
});

teardown(function (done) {
	hippie4Eyeos.logout(done);
});

test("should return status 200 when GET applications with valid card and signature", function (done) {
	hippie4Eyeos.basicRequestWithCardAndSignature()
		.get('/application/v1/applications')
		.expectStatus(200)
		.end(done);
});

//SAME TEST
test("should return status 200 when GET applications with valid card and signature", function (done) {
	var path = __dirname + '/applications.GET.har';
	hippie4Eyeos.setRequestFromHar(path, true)
		.expectStatus(200)
		.end(done);
});
