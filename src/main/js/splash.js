define([
    'skbJet/component/resourceLoader/resourceLib',
    'skbJet/componentCRDC/splash/splashLoadController',
    'skbJet/componentCRDC/splash/splashUIController'
], function(resLib, splashLoadController, splashUIController) {

    var logoDiv;
    var logoDivWidth = 612;
    var logoDivHeight = 232;
    var logoDivTop = 87;
    var logoDivLeft = 174;

    var progressBarDivWidth = 550;
    var progressBarDivHeight = 51;

    var loadDiv, progressBarDiv, progressDiv, gameImgDiv;

    function checkScreenMode() {
        var winW = Math.floor(Number(window.innerWidth));
        var winH = Math.floor(Number(window.innerHeight));
        return winW >= winH ? "landScape" : "portrait";
    }

    function updateLayoutRelatedByScreenMode() {
        if (checkScreenMode() === 'landScape') {
            document.getElementById('loadDiv').style.backgroundImage = 'url(' + resLib.splash.landscapeLoading.src + ')';
            logoDivTop = 87;
            logoDivLeft = 174;
            logoDivWidth = 612;
            logoDivHeight = 232;
        } else {
            document.getElementById('loadDiv').style.backgroundImage = 'url(' + resLib.splash.portraitLoading.src + ')';
            logoDivTop = 182;
            logoDivLeft = 25;
            logoDivWidth = 550;
            logoDivHeight = 220;
        }
    }

    function onLoadDone() {
        updateLayoutRelatedByScreenMode();
        gameImgDiv = document.getElementById("gameImgDiv");
        loadDiv = document.getElementById("loadDiv");
        progressBarDiv = document.getElementById("progressBarDiv");
        progressDiv = document.getElementById("progressDiv");
        loadDiv.style.backgroundSize = 'cover';
        progressBarDiv.style.backgroundImage = 'url(' + resLib.splash.loadingBarBack.src + ')';
        progressDiv.style.backgroundImage = 'url(' + resLib.splash.loadingBarFront.src + ')';

        logoDiv = document.createElement('div');
        logoDiv.id = 'logoDiv';
        document.getElementById('loadDiv').appendChild(logoDiv);
        logoDiv.style.position = 'absolute';
        logoDiv.style.backgroundSize = 'contain';
        logoDiv.style.backgroundRepeat = 'no-repeat';
        logoDiv.style.backgroundImage = 'url(' + resLib.splash.logo.src + ')';
        logoDiv.style.width = logoDivWidth + 'px';
        logoDiv.style.height = logoDivHeight + 'px';
        logoDiv.style.top = logoDivTop + 'px';
        logoDiv.style.left = logoDivLeft + 'px';

        progressBarDiv.style.backgroundRepeat = 'no-repeat';
        progressBarDiv.style.width = progressBarDivWidth;
        progressBarDiv.style.height = progressBarDivHeight;
        progressBarDiv.style.left = (loadDiv.offsetWidth - progressBarDiv.offsetWidth) / 2;

        progressDiv.style.width = progressBarDivWidth;
        progressDiv.style.height = progressBarDivHeight;
        progressDiv.style.left = 0;

        splashUIController.onSplashLoadDone();

        window.addEventListener('resize', onWindowResized);
        onWindowResized();
        window.postMessage('splashLoaded', window.location.origin);
    }

    function onWindowResized() {
        updateLayoutRelatedByScreenMode();
        logoDiv.style.width = splashUIController.scale(logoDivWidth);
        logoDiv.style.height = splashUIController.scale(logoDivHeight);
        logoDiv.style.top = splashUIController.scale(logoDivTop);
        logoDiv.style.left = (loadDiv.offsetWidth - logoDiv.offsetWidth) / 2 + "px";

        progressBarDiv.style.width = splashUIController.scale(progressBarDivWidth);
        progressBarDiv.style.height = splashUIController.scale(progressBarDivHeight);
        progressBarDiv.style.left = (loadDiv.offsetWidth - progressBarDiv.offsetWidth) / 2 + "px";
        progressBarDiv.style.top = gameImgDiv.offsetHeight + "px";

        progressDiv.style.height = splashUIController.scale(progressBarDivHeight);

    }

    function init() {
        splashUIController.init({ layoutType: 'IW' });
        splashLoadController.load(onLoadDone);
    }
    init();
    return {};
});