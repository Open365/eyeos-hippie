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
var HarExtractor = require('../lib/harExtractor');

suite('HarExtractor', function() {
    var sut, headersString;

    setup(function() {
        headersString = '[{"name":"Cookie","value":"m=34e2:|ca3:t|2a03:t; i18next=en_UK"},{"name":"Accept-Encoding","value":"gzip, deflate, sdch"},{"name":"Host","value":"localhost"},{"name":"Accept-Language","value":"es-ES,es;q=0.8,en;q=0.6,ca;q=0.4"},{"name":"card","value":"{\\"expiration\\":1431097120,\\"permissions\\":[\\"eyeos.vdi.exec\\",\\"eyeos.admin.profiles.edit\\"],\\"renewCardDelay\\":12600,\\"username\\":\\"eyeos\\",\\"domain\\":\\"open365.io\\"}"},{"name":"Accept","value":"application/json, text/plain, */*"},{"name":"Referer","value":"https://localhost/?TID=3bb20db2-0e03-47c8-8845-da69767420d7"},{"name":"signature","value":"gAbnSwU5xt7WvE8r6T4wbnJurasztR/I5VrawHkvSQSvNjTQUUUThFA29AinFIn8VM8yC9ok5julDjJXqhqEHQ=="},{"name":"User-Agent","value":"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.90 Safari/537.36"},{"name":"Connection","value":"keep-alive"}]';
        sut = new HarExtractor();
    });

    test('getRequest should return correct json', function() {
        var actual = sut.getRequest(__dirname + '/../samples/applications.GET.har');
        assert.equal(actual.url, 'https://localhost/application/v1/applications');
        assert.equal(actual.method, 'GET');
        assert.equal(JSON.stringify(actual.headers), headersString);
    });

    test('getResponse should return correct json', function () {
        var current = sut.getResponse(__dirname + '/../samples/login.POST.har'),
            expected = {
                "_transferSize": 206,
                "bodySize": 19,
                "content": {
                    "compression": -10,
                    "mimeType": "text/plain",
                    "size": 9
                },
                "cookies": [],
                "headers": [
                    {
                        "name": "Date",
                        "value": "Tue, 12 May 2015 10:28:41 GMT"
                    },
                    {
                        "name": "Server",
                        "value": "nginx/1.6.3"
                    },
                    {
                        "name": "Connection",
                        "value": "keep-alive"
                    },
                    {
                        "name": "Transfer-Encoding",
                        "value": "chunked"
                    },
                    {
                        "name": "X-eyeos-TID",
                        "value": "ecd1bad8-6ab7-4583-8aac-2c5351262cc6"
                    }
                ],
                "headersSize": 187,
                "httpVersion": "HTTP/1.1",
                "redirectURL": "",
                "status": 403,
                "statusText": "Forbidden"
            };
        assert.deepEqual(current, expected);
    });
});
