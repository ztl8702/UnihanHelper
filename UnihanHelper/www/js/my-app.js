/// <reference path="unicode.utils.js"/>
/// <reference path="unicode.data.js"/>
/// <reference path="../vendor/pouchdb/pouchdb-5.0.0.min.js">
// Initialize your app

var myApp = new Framework7({
    modalTitle: 'UnihanHelper',
    material: true,
    materialPageLoadDelay: 200,
    pushState: true,
    swipePanel: 'left'

});

// Export selectors engine
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true
});

// Callbacks to run specific code for specific pages, for example for About page:
myApp.onPageInit('about', function (page) {
    // run createContentPage func after link was clicked
    $$('.create-page').on('click', function () {
        createContentPage();
    });
});



//myApp.showProgressbar($('body'), 'yellow');


myApp.onPageInit('about', function (page) {

});

myApp.onPageInit('details', function (page) {
    //Query
    Unicode.Data.getUnicodeData(Unicode.getCodeInt(window.queryWord), function (doc) {
        console.log(doc);
        $("#kkCharacter")[0].textContent = Unicode.codePointToChar(Unicode.getCodePoint(window.queryWord));
        $("#kkUnicodeCodePoint")[0].textContent = Unicode.getCodePoint(window.queryWord);

        $("#kMandarin")[0].textContent = doc.kMandarin;
        $("#kPhonetic")[0].textContent = doc.kPhonetic;
        $("#kTotalStrokes")[0].textContent = doc.kTotalStrokes;
        $("#kCantonese")[0].textContent = doc.kCantonese;
        $("#kCihaiT")[0].textContent = doc.kCihaiT;
        $("#kDefinition")[0].textContent = doc.kDefinition;
        $("#kVietnamese")[0].textContent = doc.kVietnamese;
        $("#kSemanticVariant")[0].textContent = doc.kSemanticVariant;
        $("#kSimplifiedVariant")[0].textContent = (doc.kSimplifiedVariant) ? Unicode.codePointToChar(doc.kSimplifiedVariant) : 'N/A';
        $("#kTraditionalVariant")[0].textContent = (doc.kTraditionalVariant) ? Unicode.codePointToChar(doc.kTraditionalVariant) : 'N/A';
        $('#kCangjie')[0].textContent = (doc.kCangjie) ? Unicode.getCangjie(doc.kCangjie) + '(' + doc.kCangjie + ')' : 'N/A';
    }, function (error) {
        if (error.code==404)
        {
            myApp.prompt('Character is not a Unihan character!');
        }
        else
        {
            console.log('Unexpected Error' + error.toString());
        }
    });


});


function updateCode() {
    $('#code')[0].textContent = Unicode.getCodePoint($('input')[0].value);
}

function showDetails() {
    window.queryWord = ($('input')[0].value);
    mainView.router.loadPage('pages/details.html');
}

function clearInput() {
    $('input')[0].value='';
}
