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

var EyeosAuth = require('eyeos-auth');
var CredentialsManager = require('../lib/CredentialsManager');
var RequestManager = require('../lib/RequestManager');

suite('CredentialsManager suite', function () {

	var sut, eyeosAuth, requestManager;

	setup(function () {
		eyeosAuth = new EyeosAuth();
		requestManager = new RequestManager();
		sut = new CredentialsManager(eyeosAuth, requestManager);
	});

	suite('#getCard', function () {
		test("should throw exception when there is no card", function () {
			assert.throw(function () {
				sut.getCard()
			},  "There is no card. Did you login?");
		});

		test("should return the stringify card", function () {
			var data = {data: "some data"};
			sut.card = data;
			assert.equal(sut.getCard(), JSON.stringify(data));
		});
	});

	suite('#getSignature', function () {
		test("getCard should throw exception when there is no signature", function () {
			assert.throw(function () {
				sut.getSignature()
			},  "There is no signature. Did you login?");

		});

		test("should return the signature", function () {
			var data = "fake signature";
			sut.signature = data;
			assert.equal(sut.getSignature(), data);
		});
	});

	suite('#login', function () {
		var fakeAuth = {
			card: 'fake card',
			signature: 'fake signature'
		};

		test('should call to getFakeAuth when no data', function () {
			var username = 'fakeUser',
				getFakeAuthStub = sinon.stub(eyeosAuth, 'getFakeAuth').returns(fakeAuth);
			sut.login(sinon.stub(), username);
			sinon.assert.calledWithExactly(getFakeAuthStub, username, undefined);
		});

		test('should call to getFakeAuth when data is not a password', function () {
			var username = 'fakeUser',
				data = [],
				getFakeAuthStub = sinon.stub(eyeosAuth, 'getFakeAuth').returns(fakeAuth);
			sut.login(sinon.stub(), username, data);
			sinon.assert.calledWithExactly(getFakeAuthStub, username, data);
		});

		test('should call to basicRequest when has a password', function () {
			var username = 'fakeUser',
				stub = sinon.stub(requestManager, 'basicRequest').returns(hippie());
			sut.login(sinon.stub(), username, 'fakePwd');
			sinon.assert.calledWithExactly(stub);
		});

        test('should call to basicRequest when has a password and a baseURL', function () {
            var username = 'fakeUser',
                password = 'fakePwd',
                baseURL = 'http://example.com',
                stub = sinon.stub(requestManager, 'basicRequest').withArgs(baseURL).returns(hippie());
            sut.login(sinon.stub(), username, password, baseURL);
            sinon.assert.calledWithExactly(stub, baseURL);
        });

		test('should call to callback', function () {
			var callback = sinon.stub();
			sinon.stub(eyeosAuth, 'getFakeAuth').returns(fakeAuth);
			sut.login(callback, 'fakeUser');
			sinon.assert.calledWith(callback);
		});
	});

});

