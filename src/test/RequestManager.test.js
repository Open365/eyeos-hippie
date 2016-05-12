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

var sinon = require('sinon');
var assert = require('chai').assert;

var hippie = require('hippie');
var RequestManager = require('../lib/RequestManager');

suite('RequestManager suite', function () {
	var sut;

	setup(function () {
		sut = new RequestManager(hippie);
	});

	suite('#basicRequestWithUrlAndContentType', function () {
		[
			{ data: 'fakeUrl', expected : 'fakeUrl' },
			{ data: { baseUrl: 'fakeUrl', contentType: 'application/x-www-form-urlencoded' }, expected: 'fakeUrl'},
			{ data: undefined, expected: undefined }
		].forEach(function (info) {
				test('should set the baseUrl', function () {
					var stub = sinon.stub(sut, 'basicRequest').returns(hippie());
					sut.basicRequestWithUrlAndContentType(info.data);
					sinon.assert.calledWithExactly(stub, info.expected);
				});

				test('should set the contentType', function () {
					var myHippie = hippie(),
						stub = sinon.stub(myHippie, 'header');
					sinon.stub(sut, 'basicRequest').returns(myHippie);
					sut.basicRequestWithUrlAndContentType(info.data);
					sinon.assert.calledWithExactly(stub, 'Content-Type', 'application/x-www-form-urlencoded');
				});
		});

	});

});
