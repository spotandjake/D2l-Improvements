chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    if (details.url.startsWith('chrome-extension:')) return;
    if (details.url.startsWith('https://durham.elearningontario.ca/_extension/')) {
      return {
        redirectUrl: chrome.runtime.getURL(details.url.replace('https://durham.elearningontario.ca/_extension/', '')),
      };
    } else {
      switch (details.type) {
        case 'script':
          return { redirectUrl: 'data:text/javascript;charset=utf-8;base64,Ly8gcnVu' };
        case 'stylesheet':
          return { redirectUrl: 'data:text/css;charset=utf-8;base64,LyogcnVuICov' };
      } 
    }
  },
  {urls: ['<all_urls>']},
  ['blocking']
);
// chrome.webRequest.onBeforeRequest.addListener(
//   (details) => {
//     const url = new URL(details.url);
//     if (details.url.startsWith('https://durham.elearningontario.ca')) {
//       return {
//         redirectUrl: chrome.runtime.getURL('./Foreground/index.html')
//       };
//     }
//   },
//   {urls: ['<all_urls>']},
//   ['blocking']
// );