// eslint-disable-next-line no-undef
chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    switch (details.type) {
      case 'script':
        return { redirectUrl: 'data:text/javascript;charset=utf-8;base64,Ly8gcnVu' };
      case 'stylesheet':
        return { redirectUrl: 'data:text/css;charset=utf-8;base64,LyogcnVuICov' };
    }
  },
  {urls: ['<all_urls>']},
  ['blocking']
);