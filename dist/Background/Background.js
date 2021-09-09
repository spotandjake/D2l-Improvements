(function(){'use strict';chrome.webRequest.onBeforeRequest.addListener((details) => {
    if (details.url.startsWith('https://durham.elearningontario.ca')) {
        return {
            redirectUrl: chrome.runtime.getURL('./Foreground/index.html')
        };
    }
}, { urls: ['<all_urls>'] }, ['blocking']);}());