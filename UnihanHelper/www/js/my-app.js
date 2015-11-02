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

// Generate dynamic page
var dynamicPageIndex = 0;
function createContentPage() {
	mainView.router.loadContent(
        '<!-- Top Navbar-->' +
        '<div class="navbar">' +
        '  <div class="navbar-inner">' +
        '    <div class="left"><a href="#" class="back link"><i class="icon icon-back"></i><span>Back</span></a></div>' +
        '    <div class="center sliding">Dynamic Page ' + (++dynamicPageIndex) + '</div>' +
        '  </div>' +
        '</div>' +
        '<div class="pages">' +
        '  <!-- Page, data-page contains page name-->' +
        '  <div data-page="dynamic-pages" class="page">' +
        '    <!-- Scrollable page content-->' +
        '    <div class="page-content">' +
        '      <div class="content-block">' +
        '        <div class="content-block-inner">' +
        '          <p>Here is a dynamic page created on ' + new Date() + ' !</p>' +
        '          <p>Go <a href="#" class="back">back</a> or go to <a href="services.html">Services</a>.</p>' +
        '        </div>' +
        '      </div>' +
        '    </div>' +
        '  </div>' +
        '</div>'
    );
	return;
}

function loadData() {
    myApp.showPreloader('Loading data from file');
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
}
$("#appTitle")[0].textContent = "Checking database...";
var db = new PouchDB('test');
db.info().then(function (res) {
    if (res.doc_count == 0) {
        loadData();
    } else {
        myApp.prompt(res.doc_count + ' lines of data already exist.');
        $("#appTitle")[0].textContent = "Unihan Helper";
    };
}).catch(function (err) {

});

function createList(count) {
    var i, res=[];
    for (i = 1; i <= count; i++) {
        res.push({ title: 'Item ' + i });
    }
    return res;
}

myApp.onPageInit('about', function (page) {
    var nums = createList(70000);
    myApp.virtualList('.list-block.virtual-list', {
        items: nums,
        template: '<li class="item-content"><div clas="item-inner"><div class="item-title">{{title}}</div></div></li>'
    });
});

