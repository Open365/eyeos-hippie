Eyeos-hippie Library
====================

## Overview

Library for eyeos component-tests. 

It uses hippie (https://www.npmjs.com/package/hippie).

## How to use it

* **login** ( *done, username, [ data ]* )  
1. Do a login with the username and password if data is a password.

2. Do a fake login (ie get valid card and signature) with the username if data
   is undefined or an array of permissions.


    setup(function (done) {
        // fake login (get card without permissions and signature only)
        eyeosHippie.login(done, 'eyeos');
        // fake login (get card with custom permissions and signature only)
        eyeosHippie.login(done, 'eyeos', [ 'my.custom.permission' ]);
        // real login (do a real request to the authentication service)
        eyeosHippie.login(done, 'eyeos', 'eyeos');
    });

* **logout** ( *done, isReal* )  
Do a logout if it is real, removes card and signature otherwise.


* **basicRequest** ( *baseUrl = 'https://localhost'* )  
Return a basic request to baseUrl


* **basicRequestWithCardAndSignature** ( *[ baseUrl = url to request*
  **OR** *{ baseUrl: 'https://localhost', contentType: 'application/x-www-form-urlencoded' } ]* )   
Return a basic request with card and signature to baseUrl 


* **getCard**  
Return the card stringify


* **getSignature**  
Return the signature


* **setRequestFromHar** ( *path = path of the har file, authenticatedRequest = if true, do a request with card and signature* )  
Sets all the params of a request har file in order to expect something after

### eyeos-hippie utility: eyeos-split-har

Is installed in the local path

Usage: ./node_modules/.bin/eyeos-split-har [HAR_FILE_PATH] [OUTPUT_FOLDER]

### eyeos-hippie utility: eyeos-upload-file

Uses filesCdnServer to upload a file to an user directory.

Is installed in the local path
Usage: ./node_modules/.bin/eyeos-upload-file file [pathUnderUserFiles] [user] [baseUrl]

Example: Upload file: "...banana.gif" into directory "aDirectory" of user "eyeos"
```bash
./src/tools/eyeos-upload-file.js '/home/eyeos/workspace/files-server/component-test/test_files/dancing-banana.gisf' aDirectory eyeos
```

### eyeos-hippie utility: eyeos-har-to-jmx

Is installed in the local path

Usage: `./node_modules/.bin/eyeos-har-to-jmx [INPUT_HAR_FILE] [OUTPUT_JMX_FILE] [TYPE(defaults to 'stress')]`

## Quick help

* Install modules

```bash
	$ npm install
```

* Check tests

```bash
    $ grunt test
```