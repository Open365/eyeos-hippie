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

var sinon = require('sinon'),
    assert = require('chai').assert;
var fs = require('fs');
var HarToJmx = require('../lib/harToJmx'),
    HarExtractor = require('../lib/harExtractor'),
    Mustache = require('mustache'),
    Entities = require('html-entities').XmlEntities;

suite('HarToJmx', function() {
    var sut, harExtractor, harExtractorGetStub, request;

    setup(function() {
        harExtractor = new HarExtractor();
        sut = new HarToJmx(harExtractor);
    });

    test('getViewParams should return correct view on login ok', function() {
        var request = {
            "url": "https://localhost/login/v1/methods/login/",
            "postData": {
                "text": 'test body'
            },
            method: 'POST',
            headers: [
                {
                    name: 'Cookie',
                    value: 'test'
                }
            ]
        };
        harExtractorGetStub = sinon.stub(harExtractor, 'getRequest', function() {
            return request;
        });
        var actual = sut.getViewParams(__dirname + '/../samples/login.ok.POST.har');
        assert.deepEqual(actual, {
            domain: 'localhost',
            path: '/login/v1/methods/login/',
            method: 'POST',
            port: null,
            protocol: 'https',
            outputPath: './jmeter_tests.jtl',
            body: 'test body',
            headers: '<elementProp name=\"Cookie\" elementType=\"Header\">\n\t<stringProp name=\"Header.name\">Cookie</stringProp>\n\t<stringProp name=\"Header.value\">test</stringProp>\n</elementProp>\n'
        });
    });

    test('getViewParams should return correct view on applications ok', function() {
        var request = {
            "url": "https://localhost/application/v1/applications",
            method: 'GET',
            headers: [
                {
                    name: 'Cookie',
                    value: 'test'
                }
            ]
        };
        harExtractorGetStub = sinon.stub(harExtractor, 'getRequest', function() {
            return request;
        });
        var actual = sut.getViewParams(__dirname + '/../samples/applications.GET.har');
        assert.deepEqual(actual, {
            domain: 'localhost',
            path: '/application/v1/applications',
            method: 'GET',
            port: null,
            protocol: 'https',
            outputPath: './jmeter_tests.jtl',
            body: null,
            headers: '<elementProp name=\"Cookie\" elementType=\"Header\">\n\t<stringProp name=\"Header.name\">Cookie</stringProp>\n\t<stringProp name=\"Header.value\">test</stringProp>\n</elementProp>\n'
        });
    });
});
