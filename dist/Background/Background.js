(function(){'use strict';chrome.webRequest.onBeforeRequest.addListener((details) => {
    if (details.url.startsWith('chrome-extension:'))
        return;
    if (details.url.startsWith('https://durham.elearningontario.ca/_ext/')) {
        return {
            redirectUrl: chrome.runtime.getURL(details.url.replace('https://durham.elearningontario.ca/_ext/', '')),
        };
    }
}, { urls: ['<all_urls>'] }, ['blocking']);})();