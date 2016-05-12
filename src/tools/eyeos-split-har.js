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

if (process.argv.length !== 4) {
    console.log('\n\tUsage: ./node_modules/.bin/eyeos-split-har [HAR_FILE_PATH] [OUTPUT_FOLDER]\n');
    process.exit(0);
} else {
    var fs = require('fs');
    var filePath = process.argv[2];
    var folderPath = process.argv[3];
    var fileStat = fs.statSync(filePath);
    var folderStat = fs.statSync(folderPath);

    if (!fileStat.isFile()) {
        console.error('First param is not a file');
        process.exit(1);
    }
    if (!folderStat.isDirectory()) {
        console.error('Second param is not a folder');
        process.exit(1);
    }

    fs.readFile(filePath, function(err, file) {
        try {
            var inputHar = JSON.parse(file);
        } catch (e) {
            console.error('HAR file is not a valid JSON');
            process.exit(1);
        }
        var entries = inputHar.log.entries;
        var len = entries.length;

        for (var i = 0;i<len;i++) {
            var outputHarFilename = i + '.' + entries[i].request.method + '.har';
            var outputHar = {log:{}};
            outputHar.log.version = inputHar.log.version;
            outputHar.log.creator = inputHar.log.creator;
            outputHar.log.pages = inputHar.log.pages;
            outputHar.log.entries = [];
            outputHar.log.entries.push(inputHar.log.entries[i]);
            fs.writeFileSync(folderPath + '/' + outputHarFilename, JSON.stringify(outputHar, null, 2));
        }
        console.log('Finished.');
        process.exit(0);
    });
}
