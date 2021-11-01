(function(){'use strict';chrome.webRequest.onBeforeRequest.addListener((details) => {
    if (details.url.startsWith('chrome-extension:'))
        return;
    if (details.url.startsWith('https://durham.elearningontario.ca/_ext/')) {
        return {
            redirectUrl: chrome.runtime.getURL(details.url.replace('https://durham.elearningontario.ca/_ext/', '')),
        };
    }
    else {
        switch (details.type) {
            case 'script':
                return { redirectUrl: 'data:text/javascript;charset=utf-8;base64,Ly8gcnVu' };
            case 'stylesheet':
                return { redirectUrl: 'data:text/css;charset=utf-8;base64,LyogcnVuICov' };
        }
    }
}, { urls: ['<all_urls>'] }, ['blocking']);})();