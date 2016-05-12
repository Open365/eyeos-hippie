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

if (process.argv.length !== 4 && process.argv.length !== 5) {
    console.log('\n\tUsage: ./node_modules/.bin/eyeos-har-to-jmx [INPUT_HAR_FILE] [OUTPUT_JMX_FILE] [TYPE(defaults to stress)]\n');
    process.exit(0);
} else {
    //Params
    var type = process.argv[4] || 'stress';
    var inputFilename = process.argv[2];
    var outputFilename = process.argv[3];

    var fs = require('fs');
    var HarToJmx = require(__dirname + '/../lib/harToJmx');
    var harToJmx = new HarToJmx();
    var output = harToJmx.convert(inputFilename, type);

    fs.writeFileSync(outputFilename, output);
    console.log('Finished.');
    process.exit(0);
}
