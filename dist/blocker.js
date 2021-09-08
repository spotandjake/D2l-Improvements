chrome.webRequest.onBeforeRequest.addListener((e => {
  if (!e.url.startsWith('chrome-extension:')) switch (e.type) {
   case 'script':
    return {
      redirectUrl: 'data:text/javascript;charset=utf-8;base64,Ly8gcnVu'
    };

   case 'stylesheet':
    return {
      redirectUrl: 'data:text/css;charset=utf-8;base64,LyogcnVuICov'
    };
  }
}), {
  urls: [ '<all_urls>' ]
}, [ 'blocking' ]);
