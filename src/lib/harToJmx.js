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

var fs = require('fs');
var URL = require('url');
var Entities = require('html-entities').XmlEntities;
var Mustache = require('mustache');
var HarExtractor = require('./harExtractor');

function HarToJmx(harExtractor, entities, mustache, iFs) {
    this.harExtractor = harExtractor || new HarExtractor();
    this.entities = entities || new Entities();
    this.mustache = mustache || Mustache;
    this.fs = iFs || fs;
};

HarToJmx.prototype._getFile = function(path) {
    return this.fs.readFileSync(path).toString('UTF-8');
};

HarToJmx.prototype.convert = function(inputFilename, type) {
    var template = this._getFile(__dirname + '/../templates/jmeter-' + type + '-template.jmx');
    var view = this.getViewParams(inputFilename);
    return this.mustache.render(template, view);
};

HarToJmx.prototype.getViewParams = function(path) {
    var request = this.harExtractor.getRequest(path);
    var parsedUrl = URL.parse(request.url);

    return {
        domain: parsedUrl.hostname,
        path: parsedUrl.path,
        method: request.method,
        port: parsedUrl.port,
        protocol: parsedUrl.protocol.split(':')[0],
        outputPath: './jmeter_tests.jtl',
        body: request.postData ? this.entities.encode(request.postData.text) : null,
        headers: this.renderHeaders(request.headers)
    };
};

HarToJmx.prototype.renderHeaders = function(headers) {
    var template = this._getFile(__dirname + '/../templates/jmeter-header-template.jmx');
    var headersOutput = '';
    var self = this;
    headers.forEach(function(header) {
        headersOutput += self.mustache.render(template, header);
    });

    return headersOutput;
};

module.exports = HarToJmx;
