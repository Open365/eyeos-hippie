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

var HarExtractor = function(injectedFs) {
    this.fs = injectedFs || fs;
};

HarExtractor.prototype.getRequest = function(path) {
    try {
        var file = this.fs.readFileSync(path);
        var request = JSON.parse(file).log.entries[0].request;
    } catch (err) {
        console.error(err);
    }
    return request;
};

HarExtractor.prototype.getResponse = function (path) {
    var request;
    try {
        var file = this.fs.readFileSync(path);
        request = JSON.parse(file).log.entries[0].response;
    } catch (err) {
        console.error(err);
    }
    return request;
};

module.exports = HarExtractor;
