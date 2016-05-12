#!/usr/bin/env node
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
var request = require('request');
var Hippie4eyeos = require('../eyeos-hippie');
var hippie4Eyeos = new Hippie4eyeos();
var inspect = require('util').inspect;

var clArgs = process.argv.splice(2);

function printUsage () {
    console.log(
        'Usage: ./node_modules/.bin/eyeos-upload-file file [pathUnderUserFiles] [user] [baseUrl]\n' +
        'Default values:\n' +
        'pathUnderUserFiles; "/"\n' +
        'user: eyeos\n' +
        'baseUrl: https://localhost\n');
}

if (clArgs.length === 1 && (clArgs[0] === '-h' || clArgs[0] === '--help')) {
    console.log('Help:');
    printUsage();
    process.exit(0);
}

if (clArgs.length === 0 || clArgs.length > 4) {
    console.log('Wrong parameters.');
    printUsage();
    process.exit(1);
}

var filePath = clArgs[0];
try{
    var fileStat = fs.statSync(filePath);
    if (!fileStat.isFile()) {
        console.error('Expected to be a file: '+filePath);
        printUsage();
        process.exit(1);
    }
} catch(error) {
    console.error('Expected to be a file: '+filePath+ ' but: ' + error);
    console.log();
    printUsage();
    process.exit(1);
}

var pathUnderUserFiles = clArgs[1] || "/";
var user = clArgs[2] || 'eyeos';
var baseUrl = clArgs[3] || 'https://localhost';

if(pathUnderUserFiles.indexOf('/') !== 0) {
    pathUnderUserFiles = '/'+pathUnderUserFiles;
}

function doUpload () {
    var card = hippie4Eyeos.getCard();
    var signature = hippie4Eyeos.getSignature();
    var formData = {
        file: {
            value:  fs.createReadStream(filePath),
            options: {
                filename: filePath.split('/').pop()
            }
        }
    };
    var options = {
        url: baseUrl + '/userfiles' + pathUnderUserFiles,
        headers:{
            card: card,
            signature: signature
        }
    };

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    request.get(options, function(err, response, getUrlBody){
            if(err || getUrlBody.indexOf('KO') !== -1) {
                console.error('----- ERR getting fetch url for directory:', getUrlBody, err);
                process.exit(1);
            }
            var responseObj = JSON.parse(getUrlBody);
            var fetch = responseObj.url;

            request.post({url:baseUrl + fetch, formData: formData}, function optionalCallback(err, httpResponse, uploadResultBody) {
                if (err || uploadResultBody.indexOf('OK') === -1) {
                    console.error('----- ERR upload failed: ', uploadResultBody, ' fetching to:', getUrlBody, err);
                    process.exit(1);
                }
                console.log('Upload successful!  Server responded with:', uploadResultBody);
            });
        });
}

hippie4Eyeos.login(doUpload, user);//fake login. then doUpload