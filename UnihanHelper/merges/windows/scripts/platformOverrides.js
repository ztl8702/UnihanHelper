(function () {
    // Append the safeHTML polyfill
    var scriptElem = document.createElement('script');
    scriptElem.setAttribute('src', 'scripts/winstore-jscompat.js');
    if (document.body) {
        document.body.appendChild(scriptElem);
    } else {
        document.head.appendChild(scriptElem);
    }

    window.registerBackKey = function () {
        document.addEventListener("backbutton", function() {
            mainView.router.back();
            console.log("BackButton pressed!");
        }, false);

        if (Windows.Phone) {
            Windows.Phone.UI.Input.HardwareButtons.onbackpressed = function (e) {
                console.log('W10M backpressed');
                if (mainView.history.length > 1) {
                    mainView.router.back();
                    e.handled = true;
                }
                else
                {
                    e.handled = false;
                }
                
                //console.log(mainView.history);
                
            }
        }
    }
}());