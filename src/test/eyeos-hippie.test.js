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
var Hippie4eyeos = require('../eyeos-hippie');
var HarExtractor = require('../lib/harExtractor');
var CredentialsManager = require('../lib/CredentialsManager');
var RequestManager = require('../lib/RequestManager');
var hippie = require('hippie');

suite('Eyeos-Hippie suite', function () {

	var sut, harExtractor,
		request,
		credentialsManager, requestManager;

	setup(function () {
		harExtractor = new HarExtractor();
		credentialsManager = new CredentialsManager();
		requestManager = new RequestManager();
		sut = new Hippie4eyeos(harExtractor, credentialsManager, requestManager);
	});

	suite('#getCard', function () {
		test("should call to getCard", function () {
			var getCardStub = sinon.stub(credentialsManager, 'getCard');
			sut.getCard();
			sinon.assert.calledWithExactly(getCardStub);
		});
	});

	suite('#getSignature', function () {
		test("should call to getSignature", function () {
			var getSignatureStub = sinon.stub(credentialsManager, 'getSignature');
			sut.getSignature();
			sinon.assert.calledWithExactly(getSignatureStub);
		});
	});

	suite('#login', function () {
		test("should call to login", function () {
			var loginStub = sinon.stub(credentialsManager, 'login'),
				username = 'fake user',
				password = 'fake password',
				domain = 'fake domain',
				baseURL = "https://example.com";
			sut.login(sinon.stub(), username, password, baseURL, domain);
			sinon.assert.calledWithExactly(loginStub, sinon.match.func, username, password, baseURL, domain);
		});
	});

	suite('#logout', function () {
		test("should call to logout", function () {
			var logoutStub = sinon.stub(credentialsManager, 'logout'),
				isReal = 'fake param';
			sut.logout(sinon.stub(), isReal);
			sinon.assert.calledWithExactly(logoutStub, sinon.match.func, isReal);
		});
	});

	suite('#basicRequest', function () {
		test("should call to basicRequest", function () {
			var fakeUrl = 'fakeUrl',
				basicRequestStub = sinon.stub(requestManager, 'basicRequest');
			sut.basicRequest(fakeUrl);
			sinon.assert.calledWithExactly(basicRequestStub, fakeUrl);
		});
	});

	suite('#basicRequestWithCardAndSignature', function () {
		var stub, myHippie, basicRequestWithUrlAndContentTypeStub;

		setup(function () {
			myHippie = hippie();
			basicRequestWithUrlAndContentTypeStub = sinon.stub(requestManager, 'basicRequestWithUrlAndContentType')
								.returns(myHippie);
			stub = sinon.stub(credentialsManager);
		});

		test("should call to basicRequestWithUrlAndContentType", function () {
			var data = 'fake data';
			sut.basicRequestWithCardAndSignature(data);
			sinon.assert.calledWithExactly(basicRequestWithUrlAndContentTypeStub, data);
		});

		test("should call to getCard", function () {
			sut.basicRequestWithCardAndSignature('fake data');
			sinon.assert.calledWithExactly(stub.getCard);
		});

		test("should call to getSignature", function () {
			sut.basicRequestWithCardAndSignature('fake data');
			sinon.assert.calledWithExactly(stub.getSignature);
		});
	});

	suite('#setRequestFromHar', function() {
		var harExtractorStub, path,
			hippie, hippieGETStub, hippieDELETEStub, hippieHEADERStub,
			hippieSENDStub, hippiePOSTStub,
			basicRequestWithCardAndSignatureStub, basicRequestStub;

		function authenticatedRequest (path) {
			sut.setRequestFromHar(path, true);
		}

		function nonAuthenticatedRequest (path) {
			sut.setRequestFromHar(path);
		}

		setup(function() {
			request = {
				url: 'https://localhost/application/v1/applications',
				method: 'GET',
				headers: [
					{
						name: 'Cookie',
						value: 'test cookie'
					},
					{
						name: 'Host',
						value: 'localhost'
					}
				],
				bodySize: 0
			};
			hippie = {
				get:function() {},
				header:function() {},
				del: function() {},
				post: function () {},
				send: function() {}
			};
			hippieGETStub = sinon.stub(hippie, 'get').returns(hippie);
			hippieDELETEStub = sinon.stub(hippie, 'del').returns(hippie);
			hippiePOSTStub = sinon.stub(hippie, 'post').returns(hippie);
			hippieHEADERStub = sinon.stub(hippie, 'header');
			hippieSENDStub = sinon.stub(hippie, 'send');
			basicRequestWithCardAndSignatureStub = sinon.stub(sut, 'basicRequestWithCardAndSignature').returns(hippie);
			basicRequestStub = sinon.stub(sut, 'basicRequest').returns(hippie);
			harExtractorStub = sinon.stub(harExtractor, 'getRequest').returns(request);
		});

		test('should call harExtractor getRequest', function() {
			sut.setRequestFromHar(path);
			sinon.assert.calledWith(harExtractorStub, path);
		});

		test('should replace the base URL found in the HAR file if one is provided', function() {
			var baseUrl = "example.com";
			sut.setRequestFromHar(path, true, baseUrl);
			sinon.assert.calledWith(basicRequestWithCardAndSignatureStub, baseUrl);
		});

		suite('authenticated request', function () {
			test('should call correct method with path', function() {
				authenticatedRequest(path);
				sinon.assert.calledWith(hippieGETStub, '/application/v1/applications');
			});

			test('should call correct method del with path', function() {
				request.method = 'DELETE';
				authenticatedRequest(path);
				sinon.assert.calledWith(hippieDELETEStub, '/application/v1/applications');
			});

			test('should call hippie header function with each header', function() {
				authenticatedRequest(path);
				sinon.assert.calledTwice(hippieHEADERStub);
			});

		});

		suite('non authenticated request', function () {
			test('should call correct method with path', function() {
				nonAuthenticatedRequest(path);
				sinon.assert.calledWith(hippieGETStub, '/application/v1/applications');
			});

			test('should call correct method del with path', function() {
				request.method = 'DELETE';
				nonAuthenticatedRequest(path);
				sinon.assert.calledWith(hippieDELETEStub, '/application/v1/applications');
			});

			test('should call hippie header funcion with each header', function() {
				nonAuthenticatedRequest(path);
				sinon.assert.calledTwice(hippieHEADERStub);
			});
		});

		test('should call to hippie send when bodySize > 0', function () {
			var originalData = { data: "some data to send"},
				data = JSON.stringify(originalData);
			request.method = 'POST';
			request.bodySize = data.length;
			request.postData = {
				text: data
			};
			sut.setRequestFromHar(path);
			sinon.assert.calledWith(hippieSENDStub, originalData);
		});

	});

	suite('#getResponseFromHar', function () {
		var path, harExtractorStub;

		setup(function() {
			path = 'some fake path';
			harExtractorStub = sinon.stub(harExtractor, 'getResponse');
		});

		test('should call to harExtractor getResponse', function () {
			sut.getResponseFromHar(path);
			sinon.assert.calledWith(harExtractorStub, path);
		});
	});

});
