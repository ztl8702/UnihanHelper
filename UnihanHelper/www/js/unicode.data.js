/// <reference path="../vendor/pouchdb/pouchdb-5.0.0.min.js">
(function () {
    "use strict";


    Unicode.Data = {

        loadData: function (success, fail) {
            $.getJSON("data/output.txt").done(function (data) {
                //console.log('hide');
                console.log('data loaded' + data.length);
                myApp.hidePreloader();
                myApp.showPreloader('Adding data to PouchDB');
                //console.log('shown');
                db.bulkDocs(data).then(function (result) {
                    //console.log('hide');
                    myApp.hidePreloader();
                    myApp.prompt('Loaded successfully!');
                    $("#appTitle")[0].textContent = "Unihan Helper";
                    console.log(result);
                }).catch(function (err) {
                    myApp.prompt('Error adding data to PouchDB');
                    console.log(err);
                });
            }).fail(function (j, t, e) {
                console.log('getJSON error:' + t + ' | ' + e);
            });
        },
        /**
         * Find which fragment the code is in. (binary search)
         */
        getCodeLocation: function (code) {
            var start = 0, end = Unicode.Data.fragments.length - 1;
            var mid;
            while (start <= end) {
                mid = Math.floor((start + end) / 2); 
                if (Unicode.Data.fragments[mid].startCode <= code && code <= Unicode.Data.fragments[mid].endCode)
                {
                    return mid;
                }
                else
                {
                    if (code < Unicode.Data.fragments[mid].startCode)
                        end = mid - 1;
                    else
                        start = mid + 1;
                }
            }
            return null;
        },
        /**
         * Unicode.Data.getCodeLocationInFile
         */
        getCodeLocationInFile: function (code, fragID) {
            //ensure code is in the fragment
            if (!(Unicode.Data.fragments[fragID].startCode <= code && code <= Unicode.Data.fragments[fragID].endCode))
                return null;
            var position = code - Unicode.Data.fragments[fragID].startCode + Unicode.Data.fragments[fragID].offset;
            return position;
        },

        /**
         * Unicode.Data.loadFile
         */
        loadFile: function (filename,successCallback) {
            $.getJSON('data/'+filename).done(function(res){
                console.log('File loaded:' + filename);
                successCallback(res);
            }).fail(function (error) {
                console.log('Error loading file data/' + filename);
            })
        },

        /**
         * Unicode.Data.getUnicodeData 
         */
        getUnicodeData: function (code, successCallback,failCallback) {
            var fraID = this.getCodeLocation(code);
            if (fraID == null) {
                failCallback({code:404, msg:'Character Not Found in DB.'});
                return;
            }
            var dataFile = Unicode.Data.fragments[fraID].fileName;
            var codeIndex = this.getCodeLocationInFile(code,fraID);
            this.loadFile(dataFile, function (data) {
                successCallback(data[codeIndex]);
            })
        }

    };

    //load Metadata
    $.getJSON("data/fragments.json").done(function (data) {
        console.log('fragments metadata loaded.');
        Unicode.Data.fragments = data;
    }).fail(function () {
        console.log('fail loading fragments')
    });
})();